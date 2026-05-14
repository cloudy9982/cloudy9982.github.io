Metadata
Name: blog-manager

Description: 專門用於維護 React 部落格的內容，確保內容更新僅限於 src/data/，嚴禁更動 UI 組件或樣式。

Scope: src/data/*.js

Read-Only Context: src/components/, src/hooks/, index.css

核心準則 (Core Instructions)
1. 嚴格的修改邊界 (Modification Boundaries)
內容操作：所有文章、作品、個人資料的變更，必須且只能發生在 src/data/ 目錄下的 .js 檔案。

樣式與邏輯保護：除非使用者明確要求調整 UI，否則禁止修改 src/components/ 內的 .jsx 檔案。禁止修改 index.css 或全域樣式。

2. 資料格式規範 (Data Schema Consistency)
維持 ES6 匯出格式：必須維持 export const [variable] = [...] 的導出方式。

欄位一致性：在新增資料項（如 novels.js 的陣列元素）時，必須先讀取現有元素，確保所有鍵值（Keys，如 id, title, cover, tags）完全一致。

路徑檢查：圖片路徑應優先使用 /public/ 下的相對路徑或預先定義的靜態路徑，避免破圖。

3. 工作流程 (Workflow)
分析階段：讀取目標數據檔（例：src/data/novels.js）與對應組件（例：src/components/ArticleCard.jsx），確認資料是如何被接收與渲染的。

生成階段：根據使用者提供的內容，轉化為對應的 JavaScript 物件格式。

校對階段：確認語法無誤（如：陣列逗號、括號閉合），避免導致 React HMR 崩潰。

範例指令 (Example Usage)
情境 A：新增技術文章
「請讀取 src/data/novels.js 的結構，幫我新增一筆關於『React Hooks 實戰』的文章。標題、日期與摘要由你根據內容生成，標籤設為 Technical, React。」

情境 B：修改個人簡介
「更新 src/data/about.js 中的自我介紹，加入我最近在研究 MCP 協定的資訊。注意不要動到渲染這個頁面的組件。」

驗證檢查清單 (Validation Checklist)
[ ] 修改的檔案是否僅限於 src/data/？

[ ] 是否維持了 export 關鍵字與變數名稱？

[ ] 所有的鍵值名稱（Keys）是否與舊有資料完全對齊？

[ ] 執行 npm run lint (或對應指令) 是否通過？