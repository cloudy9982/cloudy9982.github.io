"""
blog_tools_server.py — MCP server for this blog project.

Lets an AI client read & write:
  • content/*.md             — Hugo-style markdown posts
  • src/data/*.js            — front-end data files (novels, travels, hakodate, etc.)

Designed for a "read → mutate string in memory → write back" workflow so
the AI can append a new novel chapter to `src/data/novels.js`, a new
journal entry to `src/data/travels.js`, a new day to `src/data/hakodate.js`,
or any future *.js array, without the server needing to understand JS AST.

Run (stdio transport, the format every MCP client speaks):
    pip install "mcp[cli]"
    python blog_tools_server.py

Register in your client (e.g. Claude Desktop / Claude Code) by pointing
it at this file with `python` as the command.
"""

from __future__ import annotations

import os
from pathlib import Path

from mcp.server.fastmcp import FastMCP

# ── Project paths ────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent
CONTENT_DIR  = PROJECT_ROOT / 'content'
DATA_DIR     = PROJECT_ROOT / 'src' / 'data'

# Whitelist: only files under these two roots can be read or written.
ALLOWED_ROOTS = (CONTENT_DIR, DATA_DIR)


def _safe_path(root: Path, name: str) -> Path:
    """Resolve `name` against `root` and refuse anything that escapes it.

    Blocks absolute paths, `..` traversal, and symlinks pointing outside
    the whitelist. Returns the resolved Path on success; raises ValueError
    otherwise.
    """
    if not name or name != name.strip():
        raise ValueError('filename must be non-empty and untrimmed-whitespace-free')
    if os.path.isabs(name):
        raise ValueError('filename must be relative to the data/content root')
    target = (root / name).resolve()
    root_resolved = root.resolve()
    if root_resolved not in target.parents and target != root_resolved:
        raise ValueError(f'path escapes its root: {name}')
    return target


# ── Server ───────────────────────────────────────────────────────────────────
mcp = FastMCP('blog-tools')


# ── content/ tools (markdown posts) ──────────────────────────────────────────
@mcp.tool()
def list_content_files() -> list[str]:
    """List every markdown file under `content/` (recursive, relative paths)."""
    if not CONTENT_DIR.exists():
        return []
    return sorted(
        str(p.relative_to(CONTENT_DIR))
        for p in CONTENT_DIR.rglob('*.md')
        if p.is_file()
    )


@mcp.tool()
def read_content_file(filename: str) -> str:
    """Read a markdown file under `content/`. `filename` is relative to that dir."""
    path = _safe_path(CONTENT_DIR, filename)
    if not path.exists():
        raise FileNotFoundError(f'content/{filename} does not exist')
    return path.read_text(encoding='utf-8')


@mcp.tool()
def write_content_file(filename: str, content: str) -> str:
    """Create or overwrite a markdown file under `content/`.

    Use this for both new posts and edits to existing ones. Returns the
    final byte count written so callers can confirm the operation.
    """
    path = _safe_path(CONTENT_DIR, filename)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8')
    return f'wrote {path.stat().st_size} bytes to content/{filename}'


# ── src/data/ tools (JS data files: novels, travels, hakodate, …) ────────────
@mcp.tool()
def list_data_files() -> list[str]:
    """List every `.js` data file under `src/data/`.

    Typical inhabitants: novels.js, travels.js, hakodate.js, travel-info.js,
    location-lookup.js, siteConfig.js, about.js.
    """
    if not DATA_DIR.exists():
        return []
    return sorted(
        p.name
        for p in DATA_DIR.iterdir()
        if p.is_file() and p.suffix == '.js'
    )


@mcp.tool()
def read_data_file(filename: str) -> str:
    """Read a JS data file under `src/data/` as raw text.

    The AI can then mutate the text in memory (e.g. splice a new chapter
    into the `chapters: [...]` array of a novel) and write it back via
    `write_data_file`.
    """
    path = _safe_path(DATA_DIR, filename)
    if not path.exists():
        raise FileNotFoundError(f'src/data/{filename} does not exist')
    if path.suffix != '.js':
        raise ValueError('read_data_file only accepts .js files')
    return path.read_text(encoding='utf-8')


@mcp.tool()
def write_data_file(filename: str, content: str) -> str:
    """Overwrite a JS data file under `src/data/`.

    Intended for the read → mutate-in-AI → write-back loop. The server does
    not validate JS syntax — run `npm run build` afterwards (or rely on the
    Vite dev server) to catch any breakage.
    """
    path = _safe_path(DATA_DIR, filename)
    if path.suffix != '.js':
        raise ValueError('write_data_file only accepts .js files')
    if not path.exists():
        raise FileNotFoundError(
            f'src/data/{filename} does not exist; create it manually first '
            'to avoid accidentally introducing files outside the known set'
        )
    path.write_text(content, encoding='utf-8')
    return f'wrote {path.stat().st_size} bytes to src/data/{filename}'


# ── Convenience metadata tool ────────────────────────────────────────────────
@mcp.tool()
def project_summary() -> dict:
    """Return a small map of the project's known data sources, useful as the
    first call in a session so the AI knows what's available."""
    return {
        'project_root': str(PROJECT_ROOT),
        'content_dir':  str(CONTENT_DIR),
        'data_dir':     str(DATA_DIR),
        'content_files': list_content_files(),
        'data_files':    list_data_files(),
        'workflow': (
            'To append a novel chapter / travel entry / hakodate day: '
            '(1) read_data_file to fetch current text, (2) mutate the string '
            "to insert the new array element, (3) write_data_file to persist."
        ),
    }


if __name__ == '__main__':
    mcp.run()
