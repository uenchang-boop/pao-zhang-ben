# 咆帳本 PWA 專案

## 目標
打造一款以柴犬為主題、適合台灣用戶的單頁 PWA 記帳 App，支援語音輸入、AI 分類學習、老人模式，並能安裝到手機主畫面離線使用。

## 已完成
- PWA 初始版本（manifest、sw.js、可安裝）
- 多帳本切換、月份切換、收支記錄 CRUD
- 語音輸入（Web Speech API）+ 雙層解析：本地 regex → Gemini API 備援
- AI 自動學習：語音解析 / 手動選類別 → 詢問用戶是否將新關鍵字加入規則
- Gemini API Key 由用戶自行輸入，存於 localStorage（只需輸入一次）
- 11 個台灣情境消費類別（吃飯/交通/想要吃/各種月費/宗教/家人/教育/醫療/科技/娛樂/投資）
- 各類別含台灣在地 regex 關鍵字規則（woofCategoryRules in localStorage）
- 長按 2 秒刪除消費類別（touchstart / mousedown 跨裝置）
- 貼圖庫系統（類別圖示）
- 字體大小四段：normal=16px / large=20px / xlarge=26px / elder=48px
- 老人模式（elder）與特大模式（xlarge）類別格強制 2 欄顯示
- 數據視覺化：圓餅圖（類別支出）+ 月度長條圖（收入/支出），支援 3個月 / 6個月 切換（Chart.js CDN）
- 記帳 / 刪除後即時刷新圖表
- CSV 匯出（含 BOM for Excel）/ 匯入（自動去重）
- 月預算上限設定 + 進度條示警（≤20% / ≤10% / 0% / -10% 四段色彩提示）
- 語音識別顯示文字隨字體模式同步縮放（font-size:1rem）

## 目前進度
所有核心功能與圖表功能均已完成並 push 至 GitHub。
最新 commit：`725c489` feat: 新增數據視覺化圖表（圓餅圖 + 月度長條圖）+ 3M/6M 切換

## 待處理
- 無明確待辦（依用戶下次需求而定）
- 可考慮：圖表匯出 / 分享功能
- 可考慮：支出上限提醒（各類別預算）
- 可考慮：深色模式

## 未解決問題
- Chart.js 圖表依賴 CDN，離線時無法渲染（可改為本地 bundle 解決）
- Gemini API 在無網路環境下僅能使用本地 regex，分類精準度降低

## 重要約定
- 所有程式碼集中在單一檔案 `index.html`（不拆 js/css）
- localStorage key 前綴：`woof`（woofBudget_v1、woofCategoryRules、woofGeminiKey、woofSavings、woofFontSize）
- GitHub repo：https://github.com/uenchang-boop/pao-zhang-ben
- GitHub Pages（舊留存）：https://uenchang-boop.github.io/puzzle-finder-pwa/
- 語音解析流程：Layer 1 本地 regex → Layer 2 Gemini 1.5 Flash API
- AI 學習需用戶確認（confirm 彈窗）才會寫入 categoryRules
- 字體模式 SIZE_MAP：`{normal:16, large:20, xlarge:26, elder:48}`

- localStorage key 新增：`woofBudgetLimit`（帳本名→預算金額的 JSON 物件）

## 最後更新：2026-04-05
