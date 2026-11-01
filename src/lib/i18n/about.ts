import type { Locale } from "./config";



export type AboutStat = { n: string; label: string };

export type AboutFaq = { q: string; a: string };

export type AboutContent = {

  badge: string;

  h1a: string;

  h1b: string;

  sub: string;

  cta1: string;

  cta2: string;

  trust: string;

  stats: AboutStat[];

  privacyKicker: string;

  privacyTitle: string;

  privacyDesc: string;

  bullets: string[];

  flow: string[];

  note: string;

  featuresTitle: string;

  featuresDesc: string;

  features: { t: string; d: string }[];

  toolsTitle: string;

  toolsDesc: string;

  toolsMore: string;

  howTitle: string;

  howDesc: string;

  steps: { t: string; d: string }[];

  faqTitle: string;

  faqs: AboutFaq[];

  ctaTitle: string;

  ctaDesc: string;


};



export const aboutContent: Record<Locale, AboutContent> = {

  ko: {

    badge: "브라우저에서만 처리 · 서버 전송 없음",

    h1a: "이미지 작업, 이제",

    h1b: "브라우저에서 끝내세요",

    sub: "유스픽은 압축·변환·리사이즈부터 PDF·워터마크·배경 제거·OCR까지 12가지 이미지 도구를 제공합니다. 설치도, 회원가입도, 파일 업로드도 없습니다.",

    cta1: "무료로 시작하기",

    cta2: "기능 살펴보기",

    trust: "회원가입 없이 · 설치 없이 · 무료",

    stats: [

      { n: "12", label: "이미지 도구" },

      { n: "8", label: "지원 언어" },

      { n: "100", label: "장 일괄 처리" },

      { n: "0", label: "서버 업로드" },

    ],

    privacyKicker: "프라이버시 우선",

    privacyTitle: "파일은 당신의 브라우저를 떠나지 않습니다",

    privacyDesc: "서버가 없는 구조라 업로드·전송·보관이 일어나지 않습니다. 민감한 문서나 사내 이미지도 외부로 나가지 않습니다.",

    bullets: ["파일 서버 전송 · 저장 없음", "웹 워커 기반 병렬 처리", "원본 파일 변경 없음", "처리 결과 즉시 다운로드"],

    flow: ["파일 선택", "브라우저에서 처리", "다운로드"],

    note: "어느 단계에서도 서버를 거치지 않습니다",

    featuresTitle: "유스픽이 다른 점",

    featuresDesc: "업로드 없는 처리, 한곳에 모인 도구, 멈추지 않는 속도.",

    features: [

      { t: "서버로 전송되지 않습니다", d: "모든 처리는 브라우저 안에서 이뤄집니다. 업로드가 없어 사내 문서·개인 사진도 안심하고 다룰 수 있습니다." },

      { t: "12가지 도구를 한곳에서", d: "압축·변환·리사이즈부터 PDF·워터마크·배경 제거·OCR까지 한 사이트에 모았습니다." },

      { t: "최대 100장 일괄 처리", d: "여러 파일을 한 번에 처리하고 결과를 ZIP으로 묶어 받을 수 있습니다." },

      { t: "AI 기능도 브라우저에서", d: "배경 제거와 OCR도 기기에서 직접 실행됩니다. 모델은 첫 실행에만 내려받습니다." },

      { t: "멈추지 않는 처리 속도", d: "웹 워커로 처리해 대량 작업 중에도 화면이 멈추지 않습니다." },

      { t: "8개 언어 지원", d: "한국어·English·日本語·简体中文·繁體中文·Bahasa Indonesia·ไทย·Русский." },

    ],

    toolsTitle: "12가지 이미지 도구",

    toolsDesc: "필요한 도구를 골라 바로 사용하세요.",

    toolsMore: "홈에서 전체 보기",

    howTitle: "사용 방법",

    howDesc: "세 단계면 끝납니다.",

    steps: [

      { t: "파일 선택", d: "드래그앤드롭 또는 파일 선택. 최대 100장, 파일당 50MB까지." },

      { t: "옵션 설정", d: "포맷·품질·크기를 고르면 브라우저에서 바로 처리됩니다." },

      { t: "저장", d: "개별 다운로드하거나 ZIP으로 한 번에 받으세요." },

    ],

    faqTitle: "자주 묻는 질문",

    faqs: [

      { q: "파일이 서버로 전송되나요?", a: "아니요. 모든 처리는 브라우저에서 이뤄지고 파일은 서버로 전송되지 않습니다." },

      { q: "회원가입이나 결제가 필요한가요?", a: "아니요. 모든 도구를 회원가입 없이 무료로 사용할 수 있습니다." },

      { q: "어떤 파일을 지원하나요?", a: "JPEG·PNG·WebP·GIF·BMP·HEIC·AVIF 이미지와 PDF를 지원합니다. TIFF와 SVG는 지원하지 않습니다." },

      { q: "대량 처리도 가능한가요?", a: "가능합니다. 한 번에 최대 100장까지 처리하고 ZIP으로 받을 수 있습니다." },

      { q: "화질은 얼마나 유지되나요?", a: "품질 또는 목표 용량을 지정할 수 있고, PNG는 무손실입니다." },

    ],

    ctaTitle: "지금 바로 시작해 보세요",

    ctaDesc: "업로드 없이, 설치 없이, 무료로.",

  },

  en: {

    badge: "Runs in your browser · Nothing is uploaded",

    h1a: "Image work,",

    h1b: "done in your browser",

    sub: "Usepic gives you 12 image tools — compress, convert, resize, PDF, watermark, background removal and OCR. No install, no sign-up, no uploads.",

    cta1: "Get started free",

    cta2: "Explore features",

    trust: "No sign-up · No install · Free",

    stats: [

      { n: "12", label: "image tools" },

      { n: "8", label: "languages" },

      { n: "100", label: "files at once" },

      { n: "0", label: "server uploads" },

    ],

    privacyKicker: "Privacy first",

    privacyTitle: "Your files never leave your browser",

    privacyDesc: "There is no server step, so nothing is uploaded, transferred or stored. Sensitive documents and internal images stay with you.",

    bullets: ["No upload or server storage", "Parallel Web Worker processing", "Original files untouched", "Instant download"],

    flow: ["Choose files", "Process in browser", "Download"],

    note: "The server is never involved",

    featuresTitle: "Why Usepic",

    featuresDesc: "No uploads, one toolbox, no waiting.",

    features: [

      { t: "Nothing is uploaded", d: "Everything runs in your browser, so private photos and work documents stay private." },

      { t: "12 tools in one place", d: "Compress, convert, resize, PDF, watermark, background removal and OCR together." },

      { t: "Up to 100 files at once", d: "Batch process files and download everything as a single ZIP." },

      { t: "On-device AI", d: "Background removal and OCR run locally. Models download only on first use." },

      { t: "Fast and responsive", d: "Web Workers keep the interface smooth even during large batches." },

      { t: "8 languages", d: "한국어 · English · 日本語 · 简体中文 · 繁體中文 · Bahasa Indonesia · ไทย · Русский." },

    ],

    toolsTitle: "12 image tools",

    toolsDesc: "Pick a tool and start right away.",

    toolsMore: "See all on home",

    howTitle: "How it works",

    howDesc: "Three steps.",

    steps: [

      { t: "Choose files", d: "Drag and drop or select. Up to 100 files, 50MB each." },

      { t: "Set options", d: "Pick format, quality and size, then run." },

      { t: "Save", d: "Download individually or grab everything as a ZIP." },

    ],

    faqTitle: "FAQ",

    faqs: [

      { q: "Are my files uploaded?", a: "No. All processing happens in your browser and files are never sent to a server." },

      { q: "Do I need an account or payment?", a: "No. Every tool is free and requires no sign-up." },

      { q: "Which formats are supported?", a: "JPEG, PNG, WebP, GIF, BMP, HEIC, AVIF and PDF. TIFF and SVG are not supported." },

      { q: "Can I process many files?", a: "Yes, up to 100 files at once with ZIP download." },

      { q: "How is quality preserved?", a: "You control quality or target size. PNG stays lossless." },

    ],

    ctaTitle: "Start right now",

    ctaDesc: "No uploads, no install, free.",

  },

  ja: {

    badge: "ブラウザ内で処理 · サーバー送信なし",

    h1a: "画像作業は、",

    h1b: "ブラウザで完結",

    sub: "ユスピックは圧縮・変換・リサイズから PDF・透かし・背景除去・OCR まで12種類の画像ツールを提供します。インストールも会員登録もアップロードも不要です。",

    cta1: "無料で始める",

    cta2: "機能を見る",

    trust: "会員登録なし · インストールなし · 無料",

    stats: [

      { n: "12", label: "画像ツール" },

      { n: "8", label: "対応言語" },

      { n: "100", label: "枚を一括処理" },

      { n: "0", label: "サーバー送信" },

    ],

    privacyKicker: "プライバシー優先",

    privacyTitle: "ファイルはブラウザの外に出ません",

    privacyDesc: "サーバーを介さないため、アップロード・送信・保存は発生しません。機密書類や社内画像も安全です。",

    bullets: ["サーバー送信・保存なし", "Web Worker による並列処理", "元ファイルは変更しない", "処理後すぐダウンロード"],

    flow: ["ファイル選択", "ブラウザで処理", "ダウンロード"],

    note: "どの段階でもサーバーを通りません",

    featuresTitle: "ユスピックの特長",

    featuresDesc: "アップロードなし、ツールは一箇所、待ち時間なし。",

    features: [

      { t: "アップロードしません", d: "すべてブラウザ内で処理するため、個人写真や社内書類も安心です。" },

      { t: "12種類を一箇所に", d: "圧縮・変換・リサイズ・PDF・透かし・背景除去・OCR をまとめました。" },

      { t: "最大100枚を一括処理", d: "複数ファイルをまとめて処理し、ZIP で受け取れます。" },

      { t: "AI もオンデバイス", d: "背景除去と OCR は端末で実行。モデルは初回のみ取得します。" },

      { t: "止まらない処理速度", d: "Web Worker により大きな処理中も画面が固まりません。" },

      { t: "8言語対応", d: "한국어 · English · 日本語 · 简体中文 · 繁體中文 · Bahasa Indonesia · ไทย · Русский." },

    ],

    toolsTitle: "12種類の画像ツール",

    toolsDesc: "必要なツールを選んで、すぐ使えます。",

    toolsMore: "ホームで一覧を見る",

    howTitle: "使い方",

    howDesc: "3ステップで完了。",

    steps: [

      { t: "ファイル選択", d: "ドラッグ＆ドロップまたは選択。最大100枚、1ファイル50MBまで。" },

      { t: "オプション設定", d: "形式・品質・サイズを選んで実行するだけ。" },

      { t: "保存", d: "個別に保存、または ZIP でまとめて取得。" },

    ],

    faqTitle: "よくある質問",

    faqs: [

      { q: "ファイルはサーバーに送信されますか？", a: "いいえ。すべてブラウザ内で処理され、サーバーには送信されません。" },

      { q: "会員登録や支払いは必要ですか？", a: "いいえ。すべてのツールを無料で利用できます。" },

      { q: "対応形式は？", a: "JPEG・PNG・WebP・GIF・BMP・HEIC・AVIF・PDF に対応。TIFF と SVG は非対応です。" },

      { q: "大量処理はできますか？", a: "はい。最大100枚まで一括処理し、ZIP で保存できます。" },

      { q: "画質は保たれますか？", a: "品質や目標サイズを指定できます。PNG は可逆です。" },

    ],

    ctaTitle: "今すぐ始めましょう",

    ctaDesc: "アップロードなし、インストールなし、無料。",

  },

  zh: {

    badge: "仅在浏览器内处理 · 不上传服务器",

    h1a: "图片处理，",

    h1b: "直接在浏览器完成",

    sub: "Usepic 提供压缩、转换、尺寸调整、PDF、水印、背景移除和 OCR 等 12 种图片工具。无需安装、无需注册、不上传文件。",

    cta1: "免费开始",

    cta2: "查看功能",

    trust: "无需注册 · 无需安装 · 免费",

    stats: [

      { n: "12", label: "图片工具" },

      { n: "8", label: "支持语言" },

      { n: "100", label: "张批量处理" },

      { n: "0", label: "服务器上传" },

    ],

    privacyKicker: "隐私优先",

    privacyTitle: "文件不会离开你的浏览器",

    privacyDesc: "没有服务器环节，因此不会上传、传输或保存。敏感文档和内部图片都留在本地。",

    bullets: ["不上传、不存储", "Web Worker 并行处理", "不修改原始文件", "处理完立即下载"],

    flow: ["选择文件", "浏览器内处理", "下载"],

    note: "任何步骤都不经过服务器",

    featuresTitle: "Usepic 的不同之处",

    featuresDesc: "无需上传、工具集中、不等待。",

    features: [

      { t: "完全不上传", d: "所有处理都在浏览器内完成，私人照片和工作文档更安全。" },

      { t: "12 种工具集中一处", d: "压缩、转换、尺寸、PDF、水印、背景移除、OCR 全部具备。" },

      { t: "最多 100 张批量", d: "一次处理多个文件，并以 ZIP 打包下载。" },

      { t: "端侧 AI", d: "背景移除与 OCR 在设备上运行，模型仅首次下载。" },

      { t: "流畅不卡顿", d: "Web Worker 让批量处理时界面依然流畅。" },

      { t: "支持 8 种语言", d: "한국어 · English · 日本語 · 简体中文 · 繁體中文 · Bahasa Indonesia · ไทย · Русский." },

    ],

    toolsTitle: "12 种图片工具",

    toolsDesc: "选择需要的工具，立即使用。",

    toolsMore: "在首页查看全部",

    howTitle: "使用方法",

    howDesc: "三步完成。",

    steps: [

      { t: "选择文件", d: "拖放或选择，最多 100 个文件，每个 50MB。" },

      { t: "设置选项", d: "选择格式、质量和尺寸后运行。" },

      { t: "保存", d: "单独下载或打包为 ZIP 下载。" },

    ],

    faqTitle: "常见问题",

    faqs: [

      { q: "文件会上传到服务器吗？", a: "不会。所有处理在浏览器内完成，文件不会发送到服务器。" },

      { q: "需要注册或付费吗？", a: "不需要。所有工具免费使用。" },

      { q: "支持哪些格式？", a: "JPEG、PNG、WebP、GIF、BMP、HEIC、AVIF 和 PDF。不支持 TIFF 和 SVG。" },

      { q: "可以批量处理吗？", a: "可以，最多 100 个文件并支持 ZIP 下载。" },

      { q: "画质会下降吗？", a: "可自行设置质量或目标大小，PNG 为无损。" },

    ],

    ctaTitle: "立即开始",

    ctaDesc: "不上传、不安装、免费。",

  },

  "zh-TW": {

    badge: "僅在瀏覽器內處理 · 不上傳伺服器",

    h1a: "圖片處理，",

    h1b: "直接在瀏覽器完成",

    sub: "Usepic 提供壓縮、轉換、尺寸調整、PDF、浮水印、去背與 OCR 等 12 種圖片工具。免安裝、免註冊、不上傳檔案。",

    cta1: "免費開始",

    cta2: "查看功能",

    trust: "免註冊 · 免安裝 · 免費",

    stats: [

      { n: "12", label: "圖片工具" },

      { n: "8", label: "支援語言" },

      { n: "100", label: "張批次處理" },

      { n: "0", label: "伺服器上傳" },

    ],

    privacyKicker: "隱私優先",

    privacyTitle: "檔案不會離開你的瀏覽器",

    privacyDesc: "沒有伺服器環節，因此不會上傳、傳輸或保存。敏感文件與內部圖片都留在本機。",

    bullets: ["不上傳、不儲存", "Web Worker 平行處理", "不修改原始檔案", "處理後立即下載"],

    flow: ["選擇檔案", "瀏覽器內處理", "下載"],

    note: "任何步驟都不經過伺服器",

    featuresTitle: "Usepic 的不同之處",

    featuresDesc: "免上傳、工具集中、不等待。",

    features: [

      { t: "完全不上傳", d: "所有處理都在瀏覽器內完成，私人照片與工作文件更安全。" },

      { t: "12 種工具集中一處", d: "壓縮、轉換、尺寸、PDF、浮水印、去背、OCR 一次到位。" },

      { t: "最多 100 張批次", d: "一次處理多個檔案，並以 ZIP 打包下載。" },

      { t: "端側 AI", d: "去背與 OCR 在裝置上執行，模型僅首次下載。" },

      { t: "流暢不卡頓", d: "Web Worker 讓批次處理時介面依然流暢。" },

      { t: "支援 8 種語言", d: "한국어 · English · 日本語 · 简体中文 · 繁體中文 · Bahasa Indonesia · ไทย · Русский." },

    ],

    toolsTitle: "12 種圖片工具",

    toolsDesc: "選擇需要的工具，立即使用。",

    toolsMore: "在首頁查看全部",

    howTitle: "使用方法",

    howDesc: "三步完成。",

    steps: [

      { t: "選擇檔案", d: "拖放或選擇，最多 100 個檔案，每個 50MB。" },

      { t: "設定選項", d: "選擇格式、品質與尺寸後執行。" },

      { t: "儲存", d: "單獨下載或打包為 ZIP 下載。" },

    ],

    faqTitle: "常見問題",

    faqs: [

      { q: "檔案會上傳到伺服器嗎？", a: "不會。所有處理在瀏覽器內完成，檔案不會傳送到伺服器。" },

      { q: "需要註冊或付費嗎？", a: "不需要。所有工具皆可免費使用。" },

      { q: "支援哪些格式？", a: "JPEG、PNG、WebP、GIF、BMP、HEIC、AVIF 與 PDF。不支援 TIFF 與 SVG。" },

      { q: "可以批次處理嗎？", a: "可以，最多 100 個檔案並支援 ZIP 下載。" },

      { q: "畫質會下降嗎？", a: "可自行設定品質或目標大小，PNG 為無損。" },

    ],

    ctaTitle: "立即開始",

    ctaDesc: "免上傳、免安裝、免費。",

  },

  id: {

    badge: "Diproses di browser · Tanpa unggah",

    h1a: "Urusan gambar,",

    h1b: "selesai di browser",

    sub: "Usepic menyediakan 12 alat gambar — kompres, konversi, ubah ukuran, PDF, watermark, hapus latar dan OCR. Tanpa instalasi, tanpa daftar, tanpa unggah.",

    cta1: "Mulai gratis",

    cta2: "Lihat fitur",

    trust: "Tanpa daftar · Tanpa instalasi · Gratis",

    stats: [

      { n: "12", label: "alat gambar" },

      { n: "8", label: "bahasa" },

      { n: "100", label: "file sekaligus" },

      { n: "0", label: "unggahan server" },

    ],

    privacyKicker: "Privasi utama",

    privacyTitle: "File Anda tidak keluar dari browser",

    privacyDesc: "Tidak ada tahap server, jadi tidak ada unggah, transfer atau penyimpanan. Dokumen sensitif tetap aman.",

    bullets: ["Tanpa unggah atau simpan di server", "Pemrosesan paralel Web Worker", "File asli tidak diubah", "Unduh langsung"],

    flow: ["Pilih file", "Proses di browser", "Unduh"],

    note: "Server tidak pernah dilibatkan",

    featuresTitle: "Keunggulan Usepic",

    featuresDesc: "Tanpa unggah, satu tempat, tanpa menunggu.",

    features: [

      { t: "Tidak ada unggahan", d: "Semua diproses di browser, foto pribadi dan dokumen kerja tetap aman." },

      { t: "12 alat dalam satu tempat", d: "Kompres, konversi, ukuran, PDF, watermark, hapus latar dan OCR." },

      { t: "Hingga 100 file sekaligus", d: "Proses banyak file lalu unduh sebagai satu ZIP." },

      { t: "AI di perangkat", d: "Hapus latar dan OCR berjalan lokal. Model hanya diunduh saat pertama." },

      { t: "Cepat dan lancar", d: "Web Worker menjaga antarmuka tetap responsif." },

      { t: "8 bahasa", d: "한국어 · English · 日本語 · 简体中文 · 繁體中文 · Bahasa Indonesia · ไทย · Русский." },

    ],

    toolsTitle: "12 alat gambar",

    toolsDesc: "Pilih alat dan langsung pakai.",

    toolsMore: "Lihat semua di beranda",

    howTitle: "Cara pakai",

    howDesc: "Tiga langkah.",

    steps: [

      { t: "Pilih file", d: "Seret atau pilih. Maksimal 100 file, 50MB per file." },

      { t: "Atur opsi", d: "Pilih format, kualitas dan ukuran lalu jalankan." },

      { t: "Simpan", d: "Unduh satu per satu atau sebagai ZIP." },

    ],

    faqTitle: "Pertanyaan umum",

    faqs: [

      { q: "Apakah file diunggah?", a: "Tidak. Semua diproses di browser dan tidak dikirim ke server." },

      { q: "Perlu akun atau bayar?", a: "Tidak. Semua alat gratis." },

      { q: "Format apa yang didukung?", a: "JPEG, PNG, WebP, GIF, BMP, HEIC, AVIF dan PDF. TIFF dan SVG tidak didukung." },

      { q: "Bisa banyak file?", a: "Ya, hingga 100 file sekaligus dengan unduhan ZIP." },

      { q: "Bagaimana kualitasnya?", a: "Kualitas atau target ukuran dapat diatur. PNG tetap lossless." },

    ],

    ctaTitle: "Mulai sekarang",

    ctaDesc: "Tanpa unggah, tanpa instalasi, gratis.",

  },

  th: {

    badge: "ประมวลผลในเบราว์เซอร์ · ไม่อัปโหลด",

    h1a: "งานภาพ",

    h1b: "จบได้ในเบราว์เซอร์",

    sub: "Usepic มีเครื่องมือภาพ 12 ชนิด ตั้งแต่บีบอัด แปลงรูปแบบ ปรับขนาด PDF ลายน้ำ ลบพื้นหลัง ไปจนถึง OCR ไม่ต้องติดตั้ง ไม่ต้องสมัคร ไม่มีการอัปโหลด",

    cta1: "เริ่มใช้ฟรี",

    cta2: "ดูฟีเจอร์",

    trust: "ไม่ต้องสมัคร · ไม่ต้องติดตั้ง · ฟรี",

    stats: [

      { n: "12", label: "เครื่องมือภาพ" },

      { n: "8", label: "ภาษา" },

      { n: "100", label: "ไฟล์ต่อครั้ง" },

      { n: "0", label: "อัปโหลดเซิร์ฟเวอร์" },

    ],

    privacyKicker: "ความเป็นส่วนตัวมาก่อน",

    privacyTitle: "ไฟล์ของคุณไม่ออกจากเบราว์เซอร์",

    privacyDesc: "ไม่มีขั้นตอนเซิร์ฟเวอร์ จึงไม่มีการอัปโหลด ส่งต่อ หรือจัดเก็บ เอกสารสำคัญยังอยู่กับคุณ",

    bullets: ["ไม่อัปโหลดหรือจัดเก็บบนเซิร์ฟเวอร์", "ประมวลผลขนานด้วย Web Worker", "ไม่แก้ไฟล์ต้นฉบับ", "ดาวน์โหลดทันที"],

    flow: ["เลือกไฟล์", "ประมวลผลในเบราว์เซอร์", "ดาวน์โหลด"],

    note: "ไม่ผ่านเซิร์ฟเวอร์ในทุกขั้นตอน",

    featuresTitle: "จุดต่างของ Usepic",

    featuresDesc: "ไม่อัปโหลด เครื่องมือครบ ไม่ต้องรอ",

    features: [

      { t: "ไม่อัปโหลดเลย", d: "ทุกอย่างทำงานในเบราว์เซอร์ รูปส่วนตัวและเอกสารงานจึงปลอดภัย" },

      { t: "12 เครื่องมือในที่เดียว", d: "บีบอัด แปลง ปรับขนาด PDF ลายน้ำ ลบพื้นหลัง และ OCR รวมไว้แล้ว" },

      { t: "สูงสุด 100 ไฟล์ต่อครั้ง", d: "ประมวลผลหลายไฟล์แล้วดาวน์โหลดเป็น ZIP" },

      { t: "AI บนอุปกรณ์", d: "ลบพื้นหลังและ OCR ทำงานในเครื่อง ดาวน์โหลดโมเดลครั้งแรกเท่านั้น" },

      { t: "เร็วและลื่น", d: "Web Worker ทำให้หน้าจอไม่ค้างระหว่างประมวลผล" },

      { t: "รองรับ 8 ภาษา", d: "한국어 · English · 日本語 · 简体中文 · 繁體中文 · Bahasa Indonesia · ไทย · Русский." },

    ],

    toolsTitle: "เครื่องมือภาพ 12 ชนิด",

    toolsDesc: "เลือกเครื่องมือแล้วเริ่มได้ทันที",

    toolsMore: "ดูทั้งหมดที่หน้าแรก",

    howTitle: "วิธีใช้",

    howDesc: "สามขั้นตอน",

    steps: [

      { t: "เลือกไฟล์", d: "ลากวางหรือเลือก สูงสุด 100 ไฟล์ ไฟล์ละ 50MB" },

      { t: "ตั้งค่า", d: "เลือกรูปแบบ คุณภาพ และขนาด แล้วรัน" },

      { t: "บันทึก", d: "ดาวน์โหลดทีละไฟล์หรือรวมเป็น ZIP" },

    ],

    faqTitle: "คำถามที่พบบ่อย",

    faqs: [

      { q: "ไฟล์ถูกอัปโหลดหรือไม่?", a: "ไม่ ประมวลผลในเบราว์เซอร์และไม่ส่งไปเซิร์ฟเวอร์" },

      { q: "ต้องสมัครหรือจ่ายเงินไหม?", a: "ไม่ ทุกเครื่องมือใช้ฟรี" },

      { q: "รองรับไฟล์อะไรบ้าง?", a: "JPEG, PNG, WebP, GIF, BMP, HEIC, AVIF และ PDF ไม่รองรับ TIFF และ SVG" },

      { q: "ประมวลผลหลายไฟล์ได้ไหม?", a: "ได้ สูงสุด 100 ไฟล์และดาวน์โหลดเป็น ZIP" },

      { q: "คุณภาพยังดีอยู่ไหม?", a: "กำหนดคุณภาพหรือขนาดเป้าหมายได้ PNG ไม่สูญเสียข้อมูล" },

    ],

    ctaTitle: "เริ่มได้เลยตอนนี้",

    ctaDesc: "ไม่อัปโหลด ไม่ติดตั้ง ฟรี",

  },

  ru: {

    badge: "Обработка в браузере · Без загрузки",

    h1a: "Работа с изображениями —",

    h1b: "прямо в браузере",

    sub: "Usepic — 12 инструментов: сжатие, конвертация, изменение размера, PDF, водяные знаки, удаление фона и OCR. Без установки, регистрации и загрузки файлов.",

    cta1: "Начать бесплатно",

    cta2: "Возможности",

    trust: "Без регистрации · Без установки · Бесплатно",

    stats: [

      { n: "12", label: "инструментов" },

      { n: "8", label: "языков" },

      { n: "100", label: "файлов сразу" },

      { n: "0", label: "загрузок на сервер" },

    ],

    privacyKicker: "Приватность прежде всего",

    privacyTitle: "Ваши файлы не покидают браузер",

    privacyDesc: "Серверного этапа нет, поэтому файлы не загружаются, не передаются и не хранятся.",

    bullets: ["Без загрузки и хранения на сервере", "Параллельная обработка Web Worker", "Оригиналы не изменяются", "Мгновенное скачивание"],

    flow: ["Выбор файлов", "Обработка в браузере", "Скачивание"],

    note: "Сервер не участвует ни на одном этапе",

    featuresTitle: "Чем отличается Usepic",

    featuresDesc: "Без загрузки, всё в одном месте, без ожидания.",

    features: [

      { t: "Ничего не загружается", d: "Всё выполняется в браузере, личные фото и рабочие документы остаются у вас." },

      { t: "12 инструментов в одном месте", d: "Сжатие, конвертация, размер, PDF, водяные знаки, удаление фона и OCR." },

      { t: "До 100 файлов за раз", d: "Пакетная обработка и скачивание одним ZIP." },

      { t: "ИИ на устройстве", d: "Удаление фона и OCR работают локально, модель скачивается один раз." },

      { t: "Быстро и плавно", d: "Web Worker не даёт интерфейсу зависать." },

      { t: "8 языков", d: "한국어 · English · 日本語 · 简体中文 · 繁體中文 · Bahasa Indonesia · ไทย · Русский." },

    ],

    toolsTitle: "12 инструментов",

    toolsDesc: "Выберите инструмент и начинайте.",

    toolsMore: "Смотреть все на главной",

    howTitle: "Как это работает",

    howDesc: "Три шага.",

    steps: [

      { t: "Выберите файлы", d: "Перетащите или выберите. До 100 файлов по 50 МБ." },

      { t: "Настройте параметры", d: "Формат, качество и размер, затем запуск." },

      { t: "Сохраните", d: "Скачивайте по одному или ZIP-архивом." },

    ],

    faqTitle: "Частые вопросы",

    faqs: [

      { q: "Файлы загружаются на сервер?", a: "Нет. Вся обработка идёт в браузере, файлы не отправляются." },

      { q: "Нужна регистрация или оплата?", a: "Нет. Все инструменты бесплатны." },

      { q: "Какие форматы поддерживаются?", a: "JPEG, PNG, WebP, GIF, BMP, HEIC, AVIF и PDF. TIFF и SVG не поддерживаются." },

      { q: "Можно обрабатывать много файлов?", a: "Да, до 100 файлов одновременно с ZIP." },

      { q: "Сохраняется ли качество?", a: "Можно задать качество или целевой размер. PNG без потерь." },

    ],

    ctaTitle: "Начните прямо сейчас",

    ctaDesc: "Без загрузки, без установки, бесплатно.",

  },

};
