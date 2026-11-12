import type { Locale } from "./config";

/**
 * 포맷 조합 전용 변환 페이지(/webp-to-jpg 등). 변환 도구와 같은 기능에 시작 포맷만 미리 고르고,
 * "webp jpg 변환"처럼 조합별로 따로 검색되는 키워드에 맞춘 제목·설명·본문을 둔다.
 */
export type PairSlug = "webp-to-jpg" | "jpg-to-webp" | "heic-to-jpg" | "png-to-jpg" | "webp-to-png";

export const PAIRS: { slug: PairSlug; from: string; to: string; format: "jpeg" | "png" | "webp" }[] = [
  { slug: "webp-to-jpg", from: "WebP", to: "JPG", format: "jpeg" },
  { slug: "jpg-to-webp", from: "JPG", to: "WebP", format: "webp" },
  { slug: "heic-to-jpg", from: "HEIC", to: "JPG", format: "jpeg" },
  { slug: "png-to-jpg", from: "PNG", to: "JPG", format: "jpeg" },
  { slug: "webp-to-png", from: "WebP", to: "PNG", format: "png" },
];

type PairText = {
  /** 화면 H1 */
  h1: string;
  /** 화면 H1 아래 설명 */
  desc: string;
  /** 검색 결과 제목 (레이아웃이 " | 브랜드"를 붙인다) */
  seoTitle: string;
  seoDesc: string;
  intro: string;
  /** "왜 변환하나요" 단락 */
  why: string[];
  faq: { q: string; a: string }[];
};

type LocaleCommon = {
  /** 다른 조합 링크 묶음 제목 */
  linksTitle: string;
  allFormats: string;
  stepsH2: (from: string, to: string) => string;
  steps: (from: string, to: string) => string[];
  whyH2: (from: string, to: string) => string;
  faqH2: string;
};

export const pairCommon: Record<Locale, LocaleCommon> = {
  ko: {
    linksTitle: "자주 찾는 변환",
    allFormats: "모든 포맷 변환",
    stepsH2: (f, t) => `${f}를 ${t}로 변환하는 방법`,
    steps: (f, t) => [
      `1단계. ${f} 이미지를 끌어다 놓거나 클릭해서 선택합니다. 여러 장을 한 번에 넣어도 됩니다.`,
      `2단계. 변환할 포맷이 ${t}로 선택되어 있는지 확인하고 필요하면 품질을 조절합니다.`,
      "3단계. 처리하기를 누르면 브라우저에서 바로 변환됩니다.",
      "4단계. 파일별로 저장하거나 모두 ZIP으로 한 번에 내려받습니다.",
    ],
    whyH2: (f, t) => `${f}를 ${t}로 바꾸는 이유`,
    faqH2: "자주 묻는 질문",
  },
  en: {
    linksTitle: "Popular conversions",
    allFormats: "All formats",
    stepsH2: (f, t) => `How to convert ${f} to ${t}`,
    steps: (f, t) => [
      `Step 1. Drag and drop your ${f} images or click to select them. You can add many at once.`,
      `Step 2. Check that ${t} is selected as the output format and adjust quality if needed.`,
      "Step 3. Press the process button. Conversion runs right in your browser.",
      "Step 4. Save each file or download them all as one ZIP.",
    ],
    whyH2: (f, t) => `Why convert ${f} to ${t}?`,
    faqH2: "FAQ",
  },
  ja: {
    linksTitle: "よく使われる変換",
    allFormats: "すべての形式",
    stepsH2: (f, t) => `${f}を${t}に変換する方法`,
    steps: (f, t) => [
      `ステップ1. ${f}画像をドラッグ＆ドロップするか、クリックして選択します。複数枚まとめて追加できます。`,
      `ステップ2. 変換先の形式が${t}になっていることを確認し、必要に応じて画質を調整します。`,
      "ステップ3. 処理ボタンを押すと、ブラウザ上ですぐに変換されます。",
      "ステップ4. ファイルごとに保存するか、まとめてZIPでダウンロードします。",
    ],
    whyH2: (f, t) => `${f}を${t}に変換する理由`,
    faqH2: "よくある質問",
  },
  zh: {
    linksTitle: "常用转换",
    allFormats: "全部格式",
    stepsH2: (f, t) => `如何将${f}转换为${t}`,
    steps: (f, t) => [
      `第1步：拖放${f}图片或点击选择，可一次添加多张。`,
      `第2步：确认输出格式已选为${t}，需要时调整画质。`,
      "第3步：点击处理按钮，转换直接在浏览器中完成。",
      "第4步：逐个保存，或打包为ZIP一次下载。",
    ],
    whyH2: (f, t) => `为什么要把${f}转换为${t}`,
    faqH2: "常见问题",
  },
  "zh-TW": {
    linksTitle: "常用轉換",
    allFormats: "全部格式",
    stepsH2: (f, t) => `如何將${f}轉換為${t}`,
    steps: (f, t) => [
      `第1步：拖放${f}圖片或點擊選擇，可一次加入多張。`,
      `第2步：確認輸出格式已選為${t}，需要時調整畫質。`,
      "第3步：按下處理按鈕，轉換直接在瀏覽器中完成。",
      "第4步：逐一儲存，或打包成ZIP一次下載。",
    ],
    whyH2: (f, t) => `為什麼要把${f}轉換為${t}`,
    faqH2: "常見問題",
  },
  id: {
    linksTitle: "Konversi populer",
    allFormats: "Semua format",
    stepsH2: (f, t) => `Cara mengubah ${f} ke ${t}`,
    steps: (f, t) => [
      `Langkah 1. Seret dan lepas gambar ${f} atau klik untuk memilih. Bisa banyak sekaligus.`,
      `Langkah 2. Pastikan format output ${t} sudah dipilih dan atur kualitas bila perlu.`,
      "Langkah 3. Tekan tombol proses. Konversi berjalan langsung di browser.",
      "Langkah 4. Simpan per file atau unduh semuanya dalam satu ZIP.",
    ],
    whyH2: (f, t) => `Mengapa mengubah ${f} ke ${t}?`,
    faqH2: "Pertanyaan umum",
  },
  th: {
    linksTitle: "การแปลงยอดนิยม",
    allFormats: "ทุกฟอร์แมต",
    stepsH2: (f, t) => `วิธีแปลง ${f} เป็น ${t}`,
    steps: (f, t) => [
      `ขั้นที่ 1 ลากรูป ${f} มาวางหรือคลิกเพื่อเลือก เพิ่มได้หลายรูปพร้อมกัน`,
      `ขั้นที่ 2 ตรวจสอบว่าเลือกฟอร์แมตปลายทางเป็น ${t} แล้ว และปรับคุณภาพได้ตามต้องการ`,
      "ขั้นที่ 3 กดปุ่มประมวลผล การแปลงจะทำในเบราว์เซอร์ทันที",
      "ขั้นที่ 4 บันทึกทีละไฟล์ หรือดาวน์โหลดทั้งหมดเป็น ZIP ไฟล์เดียว",
    ],
    whyH2: (f, t) => `ทำไมต้องแปลง ${f} เป็น ${t}`,
    faqH2: "คำถามที่พบบ่อย",
  },
  ru: {
    linksTitle: "Популярные конвертации",
    allFormats: "Все форматы",
    stepsH2: (f, t) => `Как конвертировать ${f} в ${t}`,
    steps: (f, t) => [
      `Шаг 1. Перетащите изображения ${f} или нажмите, чтобы выбрать. Можно сразу несколько.`,
      `Шаг 2. Убедитесь, что выбран формат ${t}, и при необходимости настройте качество.`,
      "Шаг 3. Нажмите кнопку обработки — конвертация идёт прямо в браузере.",
      "Шаг 4. Сохраните файлы по одному или скачайте все одним ZIP-архивом.",
    ],
    whyH2: (f, t) => `Зачем конвертировать ${f} в ${t}`,
    faqH2: "Частые вопросы",
  },
};

const PRIVACY_FAQ: Record<Locale, { q: string; a: string }> = {
  ko: { q: "이미지가 서버로 업로드되나요?", a: "아니요. 변환은 모두 내 브라우저(컴퓨터·휴대폰)에서 이루어지며 파일이 서버로 전송되지 않습니다." },
  en: { q: "Are my images uploaded to a server?", a: "No. Everything is converted in your own browser, and your files never leave your device." },
  ja: { q: "画像はサーバーにアップロードされますか？", a: "いいえ。変換はすべてお使いのブラウザ内で行われ、ファイルがサーバーに送信されることはありません。" },
  zh: { q: "图片会上传到服务器吗？", a: "不会。所有转换都在您的浏览器中完成，文件不会离开您的设备。" },
  "zh-TW": { q: "圖片會上傳到伺服器嗎？", a: "不會。所有轉換都在您的瀏覽器中完成，檔案不會離開您的裝置。" },
  id: { q: "Apakah gambar saya diunggah ke server?", a: "Tidak. Semua konversi dilakukan di browser Anda dan file tidak pernah meninggalkan perangkat." },
  th: { q: "รูปภาพจะถูกอัปโหลดไปยังเซิร์ฟเวอร์ไหม", a: "ไม่ การแปลงทั้งหมดทำในเบราว์เซอร์ของคุณ ไฟล์จะไม่ถูกส่งออกจากอุปกรณ์" },
  ru: { q: "Загружаются ли изображения на сервер?", a: "Нет. Конвертация выполняется в вашем браузере, файлы не покидают устройство." },
};

export const pairTexts: Record<Locale, Record<PairSlug, PairText>> = {
  ko: {
    "webp-to-jpg": {
      h1: "WebP JPG 변환",
      desc: "WebP 이미지를 어디서나 열리는 JPG로 바꿉니다. 여러 장을 한 번에 일괄 변환하세요.",
      seoTitle: "WebP JPG 변환 - 무료 웹피 JPG 변환기",
      seoDesc: "WebP 이미지를 JPG로 무료 변환하세요. 여러 장을 한 번에 일괄 변환하고 ZIP으로 저장, 설치·업로드 없이 브라우저에서 바로.",
      intro: "웹에서 저장한 사진이 .webp로 받아져 열리지 않거나 올릴 수 없을 때, 유즈픽 WebP JPG 변환기로 JPG 파일로 바꾸세요. 프로그램 설치 없이 무료로, 여러 장도 한 번에 변환됩니다.",
      why: [
        "WebP는 용량이 작아 웹사이트에서 많이 쓰이지만, 일부 이미지 뷰어·편집 프로그램·관공서나 쇼핑몰 업로드 화면에서는 아직 지원하지 않습니다. JPG는 거의 모든 기기와 서비스에서 열리기 때문에 공유·제출용으로 가장 안전합니다.",
        "JPG는 투명 배경을 지원하지 않으므로, 투명한 부분은 지정한 배경색(기본 흰색)으로 채워집니다. 투명 배경을 유지해야 한다면 WebP PNG 변환을 사용하세요.",
      ],
      faq: [
        { q: "WebP를 JPG로 바꾸면 화질이 떨어지나요?", a: "품질 80~90%로 변환하면 눈으로 구분하기 어려운 수준입니다. 원본에 가까운 화질이 필요하면 품질을 높여 변환하세요." },
        { q: "여러 개의 WebP 파일을 한 번에 변환할 수 있나요?", a: "네. 한 번에 최대 100장까지 넣을 수 있고, 결과는 모두 ZIP으로 한 번에 받을 수 있습니다." },
      ],
    },
    "jpg-to-webp": {
      h1: "JPG WebP 변환",
      desc: "JPG·PNG 이미지를 용량이 더 작은 WebP로 바꿔 웹사이트를 가볍게 만드세요.",
      seoTitle: "JPG WebP 변환 - 이미지 용량 줄이는 WebP 변환기",
      seoDesc: "JPG·PNG를 WebP로 무료 변환해 이미지 용량을 25~35% 이상 줄이세요. 여러 장 일괄 변환, 품질 조절, 업로드 없이 브라우저에서 처리.",
      intro: "블로그·쇼핑몰·홈페이지 이미지를 WebP로 바꾸면 화질은 비슷하게 유지하면서 용량을 크게 줄일 수 있습니다. 유즈픽에서 JPG와 PNG를 WebP로 무료 일괄 변환하세요.",
      why: [
        "WebP는 같은 화질에서 JPG보다 보통 25~35% 작고, PNG처럼 투명 배경도 지원합니다. 이미지가 가벼워지면 페이지 로딩이 빨라지고, 구글 페이지 속도 점수에도 도움이 됩니다.",
        "현재 크롬·엣지·사파리·파이어폭스 등 주요 브라우저가 모두 WebP를 지원하므로 웹사이트용 이미지로 안심하고 쓸 수 있습니다.",
      ],
      faq: [
        { q: "WebP로 바꾸면 용량이 얼마나 줄어드나요?", a: "사진에 따라 다르지만 JPG 대비 보통 25~35%, PNG 사진은 그보다 더 크게 줄어듭니다. 품질 슬라이더로 용량과 화질의 균형을 조절할 수 있습니다." },
        { q: "PNG의 투명 배경도 WebP에서 유지되나요?", a: "네. WebP는 투명도를 지원하므로 투명 배경이 그대로 유지됩니다." },
      ],
    },
    "heic-to-jpg": {
      h1: "HEIC JPG 변환",
      desc: "아이폰으로 찍은 HEIC 사진을 어디서나 열리는 JPG로 바꿉니다.",
      seoTitle: "HEIC JPG 변환 - 아이폰 사진 JPG로 무료 변환",
      seoDesc: "아이폰 HEIC 사진을 JPG로 무료 변환하세요. 윈도우 PC에서도 프로그램 설치 없이, 여러 장을 한 번에 변환하고 ZIP으로 저장.",
      intro: "아이폰 사진을 컴퓨터로 옮겼더니 .heic 파일이라 열리지 않거나 업로드가 안 될 때, 유즈픽에서 JPG로 바꾸세요. 설치 없이 브라우저에서 무료로 변환됩니다.",
      why: [
        "HEIC는 아이폰의 기본 사진 형식으로 용량이 작지만, 윈도우 기본 뷰어나 많은 웹사이트·관공서 업로드 화면에서 지원하지 않습니다. JPG로 바꾸면 어떤 기기와 서비스에서도 문제없이 열 수 있습니다.",
        "변환 과정에서 위치 정보(GPS) 같은 메타데이터는 자동으로 제거되어, 사진을 공유할 때 개인정보 노출 걱정을 덜 수 있습니다.",
      ],
      faq: [
        { q: "윈도우에서 HEIC 파일을 JPG로 바꿀 수 있나요?", a: "네. 크롬·엣지 같은 브라우저만 있으면 윈도우 PC에서도 별도 프로그램 없이 변환됩니다." },
        { q: "HEIC 변환이 느린 이유는 무엇인가요?", a: "HEIC는 브라우저가 직접 읽지 못해 변환용 모듈을 처음 한 번 내려받습니다. 이후에는 더 빠르게 처리됩니다." },
      ],
    },
    "png-to-jpg": {
      h1: "PNG JPG 변환",
      desc: "용량이 큰 PNG 이미지를 가벼운 JPG로 바꿉니다. 여러 장을 한 번에 일괄 변환하세요.",
      seoTitle: "PNG JPG 변환 - 무료 PNG JPG 변환기",
      seoDesc: "PNG 이미지를 JPG로 무료 변환해 용량을 줄이세요. 투명 배경은 원하는 색으로 채우고, 여러 장 일괄 변환·ZIP 저장까지.",
      intro: "스크린샷이나 사진이 PNG라 용량이 너무 크거나, JPG만 올릴 수 있는 곳이 있을 때 유즈픽 PNG JPG 변환기를 사용하세요. 무료로, 설치 없이 바로 변환됩니다.",
      why: [
        "PNG는 무손실 형식이라 사진을 저장하면 용량이 매우 커집니다. 사진이라면 JPG로 바꾸는 것만으로 용량이 몇 분의 일로 줄어들어 메일 첨부나 업로드가 쉬워집니다.",
        "JPG는 투명 배경을 지원하지 않습니다. 투명한 부분은 흰색 등 원하는 배경색으로 채워지니, 로고처럼 투명 배경이 필요한 이미지는 PNG나 WebP로 두세요.",
      ],
      faq: [
        { q: "PNG를 JPG로 바꾸면 투명 배경은 어떻게 되나요?", a: "JPG는 투명도를 지원하지 않아 투명한 영역이 지정한 배경색으로 채워집니다. 배경색은 변환 전에 직접 고를 수 있습니다." },
        { q: "글자가 많은 스크린샷도 JPG로 바꿔도 되나요?", a: "가능하지만 글자 가장자리가 약간 번질 수 있습니다. 품질을 90% 이상으로 높이거나, 글자가 중요한 이미지는 WebP를 권장합니다." },
      ],
    },
    "webp-to-png": {
      h1: "WebP PNG 변환",
      desc: "WebP 이미지를 투명 배경 그대로 PNG로 바꿉니다. 여러 장을 한 번에 변환하세요.",
      seoTitle: "WebP PNG 변환 - 투명 배경 유지 무료 변환",
      seoDesc: "WebP 이미지를 투명 배경 그대로 PNG로 무료 변환하세요. 편집 프로그램에서 바로 쓸 수 있게, 여러 장 일괄 변환·ZIP 저장.",
      intro: "웹에서 받은 WebP 로고·아이콘·스티커를 편집 프로그램이나 문서에서 쓰려면 PNG가 편합니다. 유즈픽에서 투명 배경을 유지한 채 무료로 변환하세요.",
      why: [
        "PNG는 무손실 형식이고 투명 배경을 지원해, 로고·아이콘·디자인 소스처럼 편집이 필요한 이미지에 적합합니다. 포토샵·피그마·PPT·한글 등 대부분의 프로그램에서 바로 열립니다.",
        "WebP의 투명 영역은 PNG로 그대로 옮겨집니다. 다만 PNG는 용량이 커질 수 있으니, 웹에 올릴 사진이라면 JPG나 WebP가 더 가볍습니다.",
      ],
      faq: [
        { q: "WebP의 투명 배경이 PNG에서도 유지되나요?", a: "네. PNG는 투명도를 지원하므로 투명 배경이 그대로 유지됩니다." },
        { q: "PNG로 바꾸면 화질이 떨어지나요?", a: "아니요. PNG는 무손실 형식이라 변환 과정에서 화질이 더 떨어지지 않습니다." },
      ],
    },
  },
  en: {
    "webp-to-jpg": {
      h1: "WebP to JPG Converter",
      desc: "Turn WebP images into JPG files that open anywhere. Convert many at once.",
      seoTitle: "WebP to JPG Converter – Free, Online, Batch",
      seoDesc: "Convert WebP to JPG for free. Batch convert many images at once and download as ZIP — no upload, no install, right in your browser.",
      intro: "Saved an image that came down as .webp and won't open or upload? Convert it to JPG with Usepic — free, no software to install, and many files at once.",
      why: [
        "WebP is small and popular on the web, but some image viewers, editors and upload forms still don't accept it. JPG opens on virtually every device and service, so it's the safest choice for sharing and submitting.",
        "JPG has no transparency, so transparent areas are filled with a background color you choose (white by default). Use WebP to PNG if you need to keep transparency.",
      ],
      faq: [
        { q: "Does converting WebP to JPG reduce quality?", a: "At 80–90% quality the difference is hard to see. Raise the quality slider if you need output closer to the original." },
        { q: "Can I convert multiple WebP files at once?", a: "Yes. Add up to 100 images at a time and download all results as a single ZIP." },
      ],
    },
    "jpg-to-webp": {
      h1: "JPG to WebP Converter",
      desc: "Convert JPG and PNG images to smaller WebP files and make your site faster.",
      seoTitle: "JPG to WebP Converter – Shrink Images for the Web",
      seoDesc: "Convert JPG and PNG to WebP for free and cut file size by 25–35% or more. Batch conversion, quality control, no upload.",
      intro: "Switching your blog, store or website images to WebP keeps them looking the same while making them much lighter. Batch convert JPG and PNG to WebP for free with Usepic.",
      why: [
        "At the same visual quality, WebP is typically 25–35% smaller than JPG and supports transparency like PNG. Lighter images mean faster pages and better Core Web Vitals.",
        "All major browsers — Chrome, Edge, Safari and Firefox — support WebP, so it's safe to use across your website.",
      ],
      faq: [
        { q: "How much smaller will my images get?", a: "It depends on the photo, but usually 25–35% smaller than JPG and even more for PNG photos. Use the quality slider to balance size and quality." },
        { q: "Is PNG transparency kept in WebP?", a: "Yes. WebP supports transparency, so transparent backgrounds are preserved." },
      ],
    },
    "heic-to-jpg": {
      h1: "HEIC to JPG Converter",
      desc: "Convert iPhone HEIC photos to JPG files that open anywhere.",
      seoTitle: "HEIC to JPG Converter – Convert iPhone Photos Free",
      seoDesc: "Convert iPhone HEIC photos to JPG for free, even on Windows. No install, batch convert many photos and save as ZIP.",
      intro: "Moved iPhone photos to your computer and got .heic files that won't open or upload? Convert them to JPG with Usepic — free and right in your browser.",
      why: [
        "HEIC is the iPhone's default photo format. It's compact, but many Windows viewers, websites and upload forms don't support it. JPG works everywhere.",
        "Location (GPS) and other metadata are removed during conversion, so you can share photos without exposing personal details.",
      ],
      faq: [
        { q: "Can I convert HEIC to JPG on Windows?", a: "Yes. Any modern browser such as Chrome or Edge is enough — no extra software required." },
        { q: "Why is the first HEIC conversion slower?", a: "Browsers can't read HEIC natively, so a decoder is downloaded once. Later conversions are faster." },
      ],
    },
    "png-to-jpg": {
      h1: "PNG to JPG Converter",
      desc: "Turn large PNG images into lightweight JPG files. Convert many at once.",
      seoTitle: "PNG to JPG Converter – Free, Online, Batch",
      seoDesc: "Convert PNG to JPG for free and shrink file size. Fill transparency with any color, batch convert and download as ZIP.",
      intro: "Screenshot or photo saved as a huge PNG, or a site that only accepts JPG? Use Usepic's PNG to JPG converter — free and instant, with nothing to install.",
      why: [
        "PNG is lossless, so photos saved as PNG get very large. Converting photos to JPG often cuts the size to a fraction, making them easy to email or upload.",
        "JPG doesn't support transparency. Transparent areas are filled with the background color you pick, so keep logos that need transparency as PNG or WebP.",
      ],
      faq: [
        { q: "What happens to transparency when converting PNG to JPG?", a: "JPG has no transparency, so transparent areas are filled with the background color you choose before converting." },
        { q: "Is JPG fine for screenshots with lots of text?", a: "It works, but text edges may blur slightly. Use 90%+ quality, or WebP for text-heavy images." },
      ],
    },
    "webp-to-png": {
      h1: "WebP to PNG Converter",
      desc: "Convert WebP images to PNG with transparency intact. Convert many at once.",
      seoTitle: "WebP to PNG Converter – Keep Transparency, Free",
      seoDesc: "Convert WebP to PNG for free while keeping transparent backgrounds. Ready for editing apps — batch convert and save as ZIP.",
      intro: "Need a WebP logo, icon or sticker in an editor or document? PNG is the easiest format. Convert with Usepic for free and keep the transparent background.",
      why: [
        "PNG is lossless and supports transparency, making it ideal for logos, icons and design assets. It opens in Photoshop, Figma, PowerPoint and almost every other app.",
        "Transparent areas in WebP carry over to PNG as-is. PNG files can be larger, so for web photos JPG or WebP stay lighter.",
      ],
      faq: [
        { q: "Is WebP transparency kept in PNG?", a: "Yes. PNG supports transparency, so transparent backgrounds are preserved." },
        { q: "Does converting to PNG lose quality?", a: "No. PNG is lossless, so the conversion adds no further quality loss." },
      ],
    },
  },
  ja: {
    "webp-to-jpg": {
      h1: "WebP JPG 変換",
      desc: "WebP画像をどこでも開けるJPGに変換します。複数枚まとめて変換できます。",
      seoTitle: "WebP JPG 変換 - 無料・一括変換ツール",
      seoDesc: "WebPをJPGに無料で変換。複数枚を一括変換してZIPで保存、インストールもアップロードも不要です。",
      intro: "保存した画像が.webpで開けない・アップロードできないときは、UsepicでJPGに変換しましょう。無料で、複数枚もまとめて変換できます。",
      why: ["WebPは軽量でWebで広く使われていますが、一部のビューアや編集ソフト、アップロードフォームでは未対応です。JPGはほぼすべての端末とサービスで開けます。"],
      faq: [],
    },
    "jpg-to-webp": {
      h1: "JPG WebP 変換",
      desc: "JPG・PNG画像を軽いWebPに変換して、サイトの表示を速くします。",
      seoTitle: "JPG WebP 変換 - 画像を軽くするWebP変換",
      seoDesc: "JPG・PNGをWebPに無料変換し、容量を25〜35%以上削減。一括変換・画質調整に対応、アップロード不要。",
      intro: "ブログやECサイトの画像をWebPにすると、見た目はほぼそのままで容量を大きく減らせます。UsepicでJPG・PNGを無料で一括変換しましょう。",
      why: ["WebPは同じ画質でJPGより通常25〜35%小さく、PNGのように透過にも対応します。画像が軽くなるとページ表示が速くなります。"],
      faq: [],
    },
    "heic-to-jpg": {
      h1: "HEIC JPG 変換",
      desc: "iPhoneで撮ったHEIC写真を、どこでも開けるJPGに変換します。",
      seoTitle: "HEIC JPG 変換 - iPhone写真を無料でJPGに",
      seoDesc: "iPhoneのHEIC写真をJPGに無料変換。Windowsでもインストール不要、複数枚を一括変換してZIPで保存。",
      intro: "iPhoneの写真をパソコンに移したら.heicで開けない、そんなときはUsepicでJPGに変換しましょう。ブラウザだけで無料で変換できます。",
      why: ["HEICはiPhoneの標準形式で容量は小さいものの、Windowsの標準ビューアや多くのWebサイトでは対応していません。JPGならどこでも開けます。"],
      faq: [],
    },
    "png-to-jpg": {
      h1: "PNG JPG 変換",
      desc: "容量の大きいPNG画像を軽いJPGに変換します。複数枚まとめて変換できます。",
      seoTitle: "PNG JPG 変換 - 無料・一括変換ツール",
      seoDesc: "PNGをJPGに無料変換して容量を削減。透過部分は好きな色で塗りつぶし、一括変換・ZIP保存に対応。",
      intro: "スクリーンショットや写真がPNGで重すぎる、JPGしか受け付けない場所がある、そんなときはUsepicのPNG JPG変換をどうぞ。",
      why: ["PNGは可逆圧縮のため、写真を保存すると容量が非常に大きくなります。写真ならJPGに変換するだけで容量が数分の一になります。"],
      faq: [],
    },
    "webp-to-png": {
      h1: "WebP PNG 変換",
      desc: "WebP画像を透過背景のままPNGに変換します。",
      seoTitle: "WebP PNG 変換 - 透過を保ったまま無料変換",
      seoDesc: "WebPを透過背景のままPNGに無料変換。編集ソフトですぐ使える形式に、一括変換・ZIP保存も可能。",
      intro: "WebPのロゴやアイコンを編集ソフトや資料で使うならPNGが便利です。Usepicなら透過を保ったまま無料で変換できます。",
      why: ["PNGは可逆形式で透過に対応しており、ロゴ・アイコン・デザイン素材に最適です。ほとんどのアプリでそのまま開けます。"],
      faq: [],
    },
  },
  zh: {
    "webp-to-jpg": {
      h1: "WebP 转 JPG",
      desc: "将WebP图片转换为随处可打开的JPG，支持批量转换。",
      seoTitle: "WebP转JPG - 免费在线批量转换",
      seoDesc: "免费将WebP转换为JPG。批量转换多张图片并打包ZIP下载，无需上传、无需安装。",
      intro: "保存的图片是.webp格式打不开或无法上传？用Usepic免费转换为JPG，可一次转换多张。",
      why: ["WebP体积小，在网页上很常见，但部分看图软件、编辑器和上传页面仍不支持。JPG几乎在所有设备和服务上都能打开。"],
      faq: [],
    },
    "jpg-to-webp": {
      h1: "JPG 转 WebP",
      desc: "将JPG、PNG图片转换为更小的WebP，让网站加载更快。",
      seoTitle: "JPG转WebP - 压缩图片体积的WebP转换器",
      seoDesc: "免费将JPG、PNG转换为WebP，体积减少25–35%以上。支持批量转换和画质调节，无需上传。",
      intro: "把博客、网店、官网图片换成WebP，画质几乎不变而体积大幅减小。用Usepic免费批量转换JPG和PNG。",
      why: ["相同画质下，WebP通常比JPG小25–35%，并像PNG一样支持透明。图片更小，页面加载更快。"],
      faq: [],
    },
    "heic-to-jpg": {
      h1: "HEIC 转 JPG",
      desc: "将iPhone拍摄的HEIC照片转换为随处可打开的JPG。",
      seoTitle: "HEIC转JPG - 免费转换iPhone照片",
      seoDesc: "免费将iPhone的HEIC照片转换为JPG，Windows上也无需安装。批量转换并打包ZIP保存。",
      intro: "把iPhone照片传到电脑后发现是.heic打不开？用Usepic在浏览器中免费转换为JPG。",
      why: ["HEIC是iPhone的默认照片格式，体积小，但Windows自带看图工具和许多网站都不支持。转换为JPG后随处可用。"],
      faq: [],
    },
    "png-to-jpg": {
      h1: "PNG 转 JPG",
      desc: "将体积较大的PNG图片转换为轻量的JPG，支持批量转换。",
      seoTitle: "PNG转JPG - 免费在线批量转换",
      seoDesc: "免费将PNG转换为JPG以减小体积。透明区域可填充任意颜色，支持批量转换和ZIP下载。",
      intro: "截图或照片保存为PNG体积太大，或者只能上传JPG？使用Usepic的PNG转JPG工具，免费即用。",
      why: ["PNG是无损格式，照片保存为PNG会非常大。照片转换为JPG后体积往往只剩几分之一。"],
      faq: [],
    },
    "webp-to-png": {
      h1: "WebP 转 PNG",
      desc: "将WebP图片转换为PNG并保留透明背景。",
      seoTitle: "WebP转PNG - 保留透明背景，免费转换",
      seoDesc: "免费将WebP转换为PNG并保留透明背景，可直接用于编辑软件，支持批量转换和ZIP下载。",
      intro: "想在编辑软件或文档中使用WebP格式的Logo、图标？PNG最方便。Usepic可保留透明背景免费转换。",
      why: ["PNG为无损格式且支持透明，非常适合Logo、图标和设计素材，几乎所有软件都能直接打开。"],
      faq: [],
    },
  },
  "zh-TW": {
    "webp-to-jpg": {
      h1: "WebP 轉 JPG",
      desc: "將WebP圖片轉換為隨處可開啟的JPG，支援批次轉換。",
      seoTitle: "WebP轉JPG - 免費線上批次轉換",
      seoDesc: "免費將WebP轉換為JPG。批次轉換多張圖片並打包ZIP下載，不需上傳、不需安裝。",
      intro: "儲存的圖片是.webp格式打不開或無法上傳？用Usepic免費轉換為JPG，可一次轉換多張。",
      why: ["WebP檔案小，在網頁上很常見，但部分看圖軟體、編輯器與上傳頁面仍不支援。JPG幾乎在所有裝置與服務上都能開啟。"],
      faq: [],
    },
    "jpg-to-webp": {
      h1: "JPG 轉 WebP",
      desc: "將JPG、PNG圖片轉換為更小的WebP，讓網站載入更快。",
      seoTitle: "JPG轉WebP - 縮小圖片容量的WebP轉換器",
      seoDesc: "免費將JPG、PNG轉換為WebP，容量減少25–35%以上。支援批次轉換與畫質調整，不需上傳。",
      intro: "把部落格、網店、官網圖片換成WebP，畫質幾乎不變而容量大幅縮小。用Usepic免費批次轉換JPG與PNG。",
      why: ["相同畫質下，WebP通常比JPG小25–35%，並像PNG一樣支援透明。圖片更小，頁面載入更快。"],
      faq: [],
    },
    "heic-to-jpg": {
      h1: "HEIC 轉 JPG",
      desc: "將iPhone拍攝的HEIC照片轉換為隨處可開啟的JPG。",
      seoTitle: "HEIC轉JPG - 免費轉換iPhone照片",
      seoDesc: "免費將iPhone的HEIC照片轉換為JPG，Windows上也不需安裝。批次轉換並打包ZIP儲存。",
      intro: "把iPhone照片傳到電腦後發現是.heic打不開？用Usepic在瀏覽器中免費轉換為JPG。",
      why: ["HEIC是iPhone的預設照片格式，檔案小，但Windows內建看圖工具與許多網站都不支援。轉換為JPG後隨處可用。"],
      faq: [],
    },
    "png-to-jpg": {
      h1: "PNG 轉 JPG",
      desc: "將容量較大的PNG圖片轉換為輕巧的JPG，支援批次轉換。",
      seoTitle: "PNG轉JPG - 免費線上批次轉換",
      seoDesc: "免費將PNG轉換為JPG以縮小容量。透明區域可填入任意顏色，支援批次轉換與ZIP下載。",
      intro: "截圖或照片存成PNG容量太大，或只能上傳JPG？使用Usepic的PNG轉JPG工具，免費即用。",
      why: ["PNG是無損格式，照片存成PNG會非常大。照片轉換為JPG後容量往往只剩幾分之一。"],
      faq: [],
    },
    "webp-to-png": {
      h1: "WebP 轉 PNG",
      desc: "將WebP圖片轉換為PNG並保留透明背景。",
      seoTitle: "WebP轉PNG - 保留透明背景，免費轉換",
      seoDesc: "免費將WebP轉換為PNG並保留透明背景，可直接用於編輯軟體，支援批次轉換與ZIP下載。",
      intro: "想在編輯軟體或文件中使用WebP格式的Logo、圖示？PNG最方便。Usepic可保留透明背景免費轉換。",
      why: ["PNG為無損格式且支援透明，非常適合Logo、圖示與設計素材，幾乎所有軟體都能直接開啟。"],
      faq: [],
    },
  },
  id: {
    "webp-to-jpg": {
      h1: "Ubah WebP ke JPG",
      desc: "Ubah gambar WebP menjadi JPG yang bisa dibuka di mana saja. Bisa banyak sekaligus.",
      seoTitle: "WebP ke JPG – Konverter Gratis, Online, Massal",
      seoDesc: "Ubah WebP ke JPG gratis. Konversi banyak gambar sekaligus dan unduh sebagai ZIP — tanpa unggah, tanpa instal.",
      intro: "Gambar tersimpan sebagai .webp dan tidak bisa dibuka atau diunggah? Ubah ke JPG dengan Usepic — gratis dan bisa banyak sekaligus.",
      why: ["WebP berukuran kecil dan populer di web, tetapi sebagian penampil gambar, editor, dan formulir unggah belum mendukungnya. JPG bisa dibuka di hampir semua perangkat dan layanan."],
      faq: [],
    },
    "jpg-to-webp": {
      h1: "Ubah JPG ke WebP",
      desc: "Ubah gambar JPG dan PNG menjadi WebP yang lebih kecil agar situs lebih cepat.",
      seoTitle: "JPG ke WebP – Perkecil Ukuran Gambar untuk Web",
      seoDesc: "Ubah JPG dan PNG ke WebP gratis dan hemat ukuran 25–35% atau lebih. Konversi massal, atur kualitas, tanpa unggah.",
      intro: "Mengganti gambar blog, toko, atau situs ke WebP membuat tampilannya tetap sama tetapi jauh lebih ringan. Konversi JPG dan PNG ke WebP gratis dengan Usepic.",
      why: ["Pada kualitas yang sama, WebP biasanya 25–35% lebih kecil dari JPG dan mendukung transparansi seperti PNG. Gambar lebih ringan berarti halaman lebih cepat."],
      faq: [],
    },
    "heic-to-jpg": {
      h1: "Ubah HEIC ke JPG",
      desc: "Ubah foto HEIC dari iPhone menjadi JPG yang bisa dibuka di mana saja.",
      seoTitle: "HEIC ke JPG – Ubah Foto iPhone Gratis",
      seoDesc: "Ubah foto HEIC iPhone ke JPG gratis, bahkan di Windows. Tanpa instal, konversi banyak foto dan simpan sebagai ZIP.",
      intro: "Memindahkan foto iPhone ke komputer lalu mendapat file .heic yang tidak bisa dibuka? Ubah ke JPG dengan Usepic langsung di browser, gratis.",
      why: ["HEIC adalah format foto bawaan iPhone. Ukurannya kecil, tetapi banyak penampil Windows dan situs web tidak mendukungnya. JPG bisa dipakai di mana saja."],
      faq: [],
    },
    "png-to-jpg": {
      h1: "Ubah PNG ke JPG",
      desc: "Ubah gambar PNG yang besar menjadi JPG yang ringan. Bisa banyak sekaligus.",
      seoTitle: "PNG ke JPG – Konverter Gratis, Online, Massal",
      seoDesc: "Ubah PNG ke JPG gratis dan perkecil ukuran file. Isi area transparan dengan warna apa pun, konversi massal, unduh ZIP.",
      intro: "Screenshot atau foto tersimpan sebagai PNG yang besar, atau situs hanya menerima JPG? Gunakan konverter PNG ke JPG Usepic — gratis dan instan.",
      why: ["PNG bersifat lossless sehingga foto yang disimpan sebagai PNG menjadi sangat besar. Mengubah foto ke JPG sering memangkas ukurannya berkali-kali lipat."],
      faq: [],
    },
    "webp-to-png": {
      h1: "Ubah WebP ke PNG",
      desc: "Ubah gambar WebP ke PNG dengan latar transparan tetap terjaga.",
      seoTitle: "WebP ke PNG – Transparansi Tetap, Gratis",
      seoDesc: "Ubah WebP ke PNG gratis dengan latar transparan tetap terjaga. Siap untuk aplikasi edit — konversi massal dan simpan ZIP.",
      intro: "Butuh logo, ikon, atau stiker WebP di editor atau dokumen? PNG paling praktis. Ubah dengan Usepic secara gratis dan latar transparan tetap terjaga.",
      why: ["PNG bersifat lossless dan mendukung transparansi, cocok untuk logo, ikon, dan aset desain. Bisa dibuka di hampir semua aplikasi."],
      faq: [],
    },
  },
  th: {
    "webp-to-jpg": {
      h1: "แปลง WebP เป็น JPG",
      desc: "แปลงรูป WebP เป็น JPG ที่เปิดได้ทุกที่ แปลงหลายรูปพร้อมกันได้",
      seoTitle: "แปลง WebP เป็น JPG ฟรี ออนไลน์ แปลงทีละหลายไฟล์",
      seoDesc: "แปลง WebP เป็น JPG ฟรี แปลงหลายรูปพร้อมกันและดาวน์โหลดเป็น ZIP ไม่ต้องอัปโหลด ไม่ต้องติดตั้ง",
      intro: "รูปที่บันทึกมาเป็น .webp เปิดไม่ได้หรืออัปโหลดไม่ได้ใช่ไหม แปลงเป็น JPG ด้วย Usepic ฟรีและแปลงได้หลายไฟล์พร้อมกัน",
      why: ["WebP มีขนาดเล็กและนิยมบนเว็บ แต่โปรแกรมดูรูป โปรแกรมแต่งรูป และหน้าอัปโหลดบางแห่งยังไม่รองรับ JPG เปิดได้แทบทุกอุปกรณ์และบริการ"],
      faq: [],
    },
    "jpg-to-webp": {
      h1: "แปลง JPG เป็น WebP",
      desc: "แปลงรูป JPG และ PNG เป็น WebP ที่เล็กกว่า ช่วยให้เว็บโหลดเร็วขึ้น",
      seoTitle: "แปลง JPG เป็น WebP ลดขนาดรูปสำหรับเว็บ",
      seoDesc: "แปลง JPG และ PNG เป็น WebP ฟรี ลดขนาดไฟล์ได้ 25–35% ขึ้นไป แปลงหลายไฟล์ ปรับคุณภาพได้ ไม่ต้องอัปโหลด",
      intro: "เปลี่ยนรูปบนบล็อก ร้านค้า หรือเว็บไซต์เป็น WebP จะได้ภาพที่ดูเหมือนเดิมแต่เบากว่ามาก แปลง JPG และ PNG เป็น WebP ฟรีด้วย Usepic",
      why: ["ที่คุณภาพเท่ากัน WebP มักเล็กกว่า JPG 25–35% และรองรับพื้นหลังโปร่งใสเหมือน PNG รูปที่เบาลงทำให้หน้าเว็บโหลดเร็วขึ้น"],
      faq: [],
    },
    "heic-to-jpg": {
      h1: "แปลง HEIC เป็น JPG",
      desc: "แปลงรูป HEIC จาก iPhone เป็น JPG ที่เปิดได้ทุกที่",
      seoTitle: "แปลง HEIC เป็น JPG แปลงรูป iPhone ฟรี",
      seoDesc: "แปลงรูป HEIC จาก iPhone เป็น JPG ฟรี ใช้บน Windows ได้โดยไม่ต้องติดตั้ง แปลงหลายรูปและบันทึกเป็น ZIP",
      intro: "ย้ายรูปจาก iPhone ลงคอมแล้วได้ไฟล์ .heic ที่เปิดไม่ได้ใช่ไหม แปลงเป็น JPG ด้วย Usepic ในเบราว์เซอร์ได้ฟรี",
      why: ["HEIC เป็นฟอร์แมตรูปเริ่มต้นของ iPhone ขนาดเล็กแต่โปรแกรมดูรูปของ Windows และหลายเว็บไซต์ไม่รองรับ แปลงเป็น JPG แล้วใช้ได้ทุกที่"],
      faq: [],
    },
    "png-to-jpg": {
      h1: "แปลง PNG เป็น JPG",
      desc: "แปลงรูป PNG ขนาดใหญ่เป็น JPG ที่เบากว่า แปลงหลายรูปพร้อมกันได้",
      seoTitle: "แปลง PNG เป็น JPG ฟรี ออนไลน์ แปลงทีละหลายไฟล์",
      seoDesc: "แปลง PNG เป็น JPG ฟรีเพื่อลดขนาดไฟล์ เติมสีพื้นที่โปร่งใสได้ตามต้องการ แปลงหลายไฟล์และดาวน์โหลด ZIP",
      intro: "ภาพหน้าจอหรือรูปที่เป็น PNG ใหญ่เกินไป หรือเว็บรับแค่ JPG ใช้ตัวแปลง PNG เป็น JPG ของ Usepic ฟรีและใช้ได้ทันที",
      why: ["PNG เป็นแบบไม่สูญเสียคุณภาพ รูปถ่ายที่บันทึกเป็น PNG จึงใหญ่มาก แปลงเป็น JPG แล้วขนาดมักลดลงหลายเท่า"],
      faq: [],
    },
    "webp-to-png": {
      h1: "แปลง WebP เป็น PNG",
      desc: "แปลงรูป WebP เป็น PNG โดยคงพื้นหลังโปร่งใสไว้",
      seoTitle: "แปลง WebP เป็น PNG คงพื้นหลังโปร่งใส ฟรี",
      seoDesc: "แปลง WebP เป็น PNG ฟรีโดยคงพื้นหลังโปร่งใส พร้อมใช้ในโปรแกรมแต่งรูป แปลงหลายไฟล์และบันทึก ZIP",
      intro: "ต้องการใช้โลโก้หรือไอคอน WebP ในโปรแกรมแต่งรูปหรือเอกสาร PNG สะดวกที่สุด แปลงด้วย Usepic ฟรีและคงพื้นหลังโปร่งใสไว้",
      why: ["PNG เป็นแบบไม่สูญเสียคุณภาพและรองรับความโปร่งใส เหมาะกับโลโก้ ไอคอน และไฟล์งานออกแบบ เปิดได้แทบทุกโปรแกรม"],
      faq: [],
    },
  },
  ru: {
    "webp-to-jpg": {
      h1: "Конвертер WebP в JPG",
      desc: "Превратите WebP в JPG, который открывается везде. Можно сразу много файлов.",
      seoTitle: "WebP в JPG — бесплатный онлайн-конвертер",
      seoDesc: "Конвертируйте WebP в JPG бесплатно. Пакетная обработка и скачивание ZIP — без загрузки на сервер и установки.",
      intro: "Картинка сохранилась как .webp и не открывается или не загружается? Конвертируйте её в JPG с Usepic — бесплатно и сразу много файлов.",
      why: ["WebP компактен и популярен в вебе, но некоторые просмотрщики, редакторы и формы загрузки его не поддерживают. JPG открывается практически везде."],
      faq: [],
    },
    "jpg-to-webp": {
      h1: "Конвертер JPG в WebP",
      desc: "Конвертируйте JPG и PNG в лёгкий WebP, чтобы сайт загружался быстрее.",
      seoTitle: "JPG в WebP — уменьшите изображения для сайта",
      seoDesc: "Бесплатно конвертируйте JPG и PNG в WebP и уменьшите размер на 25–35% и больше. Пакетно, с настройкой качества, без загрузки.",
      intro: "Перевод изображений блога, магазина или сайта в WebP сохраняет их вид, но делает намного легче. Пакетно конвертируйте JPG и PNG в WebP бесплатно с Usepic.",
      why: ["При том же качестве WebP обычно на 25–35% меньше JPG и поддерживает прозрачность, как PNG. Лёгкие изображения ускоряют загрузку страниц."],
      faq: [],
    },
    "heic-to-jpg": {
      h1: "Конвертер HEIC в JPG",
      desc: "Конвертируйте фото HEIC с iPhone в JPG, который открывается везде.",
      seoTitle: "HEIC в JPG — бесплатная конвертация фото iPhone",
      seoDesc: "Бесплатно конвертируйте фото HEIC с iPhone в JPG, даже на Windows. Без установки, пакетно, с сохранением в ZIP.",
      intro: "Перенесли фото с iPhone на компьютер, а файлы .heic не открываются? Конвертируйте их в JPG с Usepic прямо в браузере — бесплатно.",
      why: ["HEIC — стандартный формат фото iPhone. Он компактный, но многие программы Windows и сайты его не поддерживают. JPG работает везде."],
      faq: [],
    },
    "png-to-jpg": {
      h1: "Конвертер PNG в JPG",
      desc: "Превратите тяжёлые PNG в лёгкие JPG. Можно сразу много файлов.",
      seoTitle: "PNG в JPG — бесплатный онлайн-конвертер",
      seoDesc: "Бесплатно конвертируйте PNG в JPG и уменьшите размер. Заливка прозрачности любым цветом, пакетная обработка, скачивание ZIP.",
      intro: "Скриншот или фото в огромном PNG, или сайт принимает только JPG? Используйте конвертер PNG в JPG от Usepic — бесплатно и мгновенно.",
      why: ["PNG — формат без потерь, поэтому фото в PNG получаются очень большими. Конвертация фото в JPG часто уменьшает размер в несколько раз."],
      faq: [],
    },
    "webp-to-png": {
      h1: "Конвертер WebP в PNG",
      desc: "Конвертируйте WebP в PNG с сохранением прозрачного фона.",
      seoTitle: "WebP в PNG — с прозрачностью, бесплатно",
      seoDesc: "Бесплатно конвертируйте WebP в PNG с сохранением прозрачного фона. Готово для редакторов — пакетно и с сохранением в ZIP.",
      intro: "Нужен логотип, иконка или стикер в формате WebP для редактора или документа? PNG удобнее всего. Конвертируйте с Usepic бесплатно, сохранив прозрачность.",
      why: ["PNG — формат без потерь с поддержкой прозрачности, идеален для логотипов, иконок и дизайнерских материалов. Открывается почти в любом приложении."],
      faq: [],
    },
  },
};

/** 모든 언어 공통 개인정보 FAQ를 붙인 FAQ 목록 */
export function pairFaq(locale: Locale, slug: PairSlug) {
  return [...pairTexts[locale][slug].faq, PRIVACY_FAQ[locale]];
}
