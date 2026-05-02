// ============================================================
// 圖示模組 — 集中管理所有 icon（lucide + 自訂 SVG）
// ============================================================
export {
  Home,
  User,
  Archive,
  Search,
  Link as LinkIcon,
  Moon,
  Sun,
  Calendar,
  Clock,
  Languages,
  Tag,
  ChevronRight,
  ChevronLeft,
  Type,
  Menu,
  X,
  BookOpen,
  List,
  Camera,       // 大頭照相機 icon（用於 avatar 編輯）
  ExternalLink,
  Edit2,
} from 'lucide-react';

/** GitHub (lucide 已移除品牌 icon，自行維護) */
export const GithubIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4" />
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3" />
  </svg>
);

/** Twitter / X */
export const TwitterIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
