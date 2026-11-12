import type { Locale } from "./config";

/**
 * 검색 결과용 제목·설명. 화면의 도구 이름(사전 title/desc)과 분리해 실제 검색어에 맞춘다.
 * 키워드 근거: 구글·네이버 자동완성 (2026-11, "사진 용량 줄이기", "webp jpg 변환", "누끼 따기" 등).
 * 항목이 없는 언어·페이지는 사전의 title/desc 를 그대로 쓴다.
 * 홈(home)은 브랜드까지 포함한 전체 제목, 나머지는 레이아웃 템플릿이 " | 유즈픽"을 붙인다.
 */
export type SeoPage =
  | "home"
  | "allin"
  | "compress"
  | "convert"
  | "resize"
  | "topdf"
  | "pdfimg"
  | "crop"
  | "wm"
  | "mask"
  | "bg"
  | "ocr"
  | "fav"
  | "privacy";

type SeoText = { title: string; desc: string };

const seoMeta: Partial<Record<Locale, Partial<Record<SeoPage, SeoText>>>> = {
  ko: {
    home: {
      title: "무료 이미지 변환·압축·크기 조절 사이트 | 유즈픽",
      desc: "WebP·JPG·PNG·HEIC 변환, 사진 용량 줄이기, 크기 조절, 배경 제거까지 12가지 이미지 도구를 무료로. 업로드 없이 브라우저에서 바로 처리해요.",
    },
    convert: {
      title: "WebP JPG PNG 변환 - 무료 이미지 변환기",
      desc: "WebP를 JPG로, JPG·PNG를 WebP로, 아이폰 HEIC 사진을 JPG로 무료 변환. 여러 장을 한 번에 바꾸고 ZIP으로 받으세요.",
    },
    compress: {
      title: "사진 용량 줄이기 - 이미지 압축 무료",
      desc: "화질은 그대로, 사진 용량만 무료로 줄여요. 50KB·500KB처럼 목표 용량 지정, JPG·PNG·WebP 여러 장 일괄 압축.",
    },
    resize: {
      title: "사진 크기 줄이기·이미지 크기 조절",
      desc: "픽셀·비율로 사진 크기를 줄이고 이미지 사이즈를 조절하세요. 비율 유지, 여러 장 일괄 조절, 유튜브·인스타 규격 프리셋 지원.",
    },
    allin: {
      title: "이미지 압축·변환·크기 조절 한 번에",
      desc: "용량 줄이기, WebP·JPG 변환, 사이즈 조절을 한 번에 적용하는 무료 이미지 일괄 처리 도구. 여러 장도 한 번에.",
    },
    topdf: {
      title: "JPG PDF 변환 - 사진 여러 장 PDF로 합치기",
      desc: "JPG·PNG 사진 여러 장을 순서대로 하나의 PDF로 무료 변환. A4 맞춤·여백 설정으로 증명서·서류 제출용으로 간편하게.",
    },
    pdfimg: {
      title: "PDF JPG 변환 - PDF를 이미지로 무료 변환",
      desc: "PDF 각 페이지를 고화질 JPG·PNG 이미지로 무료 변환하고 ZIP으로 한 번에 받으세요. 프로그램 설치 없이 바로.",
    },
    crop: {
      title: "사진 자르기·회전 - 이미지 자르기 무료",
      desc: "원하는 영역만 사진을 자르고 90° 회전·좌우 반전까지. 격자·중앙 가이드로 정확하게, 여러 장 일괄 적용.",
    },
    wm: {
      title: "사진 워터마크 넣기 - 무료 일괄 삽입",
      desc: "텍스트나 로고로 사진에 워터마크를 무료로 넣으세요. 위치·크기·투명도 조절, 여러 장 한 번에 일괄 삽입.",
    },
    mask: {
      title: "사진 모자이크·블러 처리 사이트",
      desc: "얼굴·차량 번호·주소 등 개인정보를 모자이크나 블러로 가리세요. 여러 영역 지정, 무료, 사진이 서버로 전송되지 않아 안전해요.",
    },
    bg: {
      title: "배경 제거·누끼 따기 무료 - AI 배경 지우기",
      desc: "AI가 사진 배경을 자동으로 지우고 투명 배경 PNG로 만들어요. 누끼 따기를 무료로, 회원가입·업로드 없이.",
    },
    ocr: {
      title: "이미지 텍스트 추출 - 사진 글자 추출 무료",
      desc: "사진·스크린샷 속 글자를 텍스트로 추출해 바로 복사하세요. 한국어·영어·일본어 OCR, 무료, 업로드 없이.",
    },
    fav: {
      title: "파비콘 만들기 - ICO 파비콘 생성기 무료",
      desc: "이미지 한 장으로 favicon.ico와 16~512px PNG, 애플 터치 아이콘까지 파비콘 세트를 무료로 만들어 ZIP으로 받으세요.",
    },
    privacy: {
      title: "개인정보처리방침",
      desc: "유즈픽의 개인정보 처리 방식 안내. 이미지는 서버로 전송되지 않으며, 쿠키·분석 도구 사용 범위를 설명합니다.",
    },
  },
  en: {
    home: {
      title: "Free Image Converter, Compressor & Resizer | Usepic",
      desc: "Convert WebP, JPG, PNG and HEIC, compress images to 100KB or 1MB, resize, crop and remove backgrounds — 12 free tools that run in your browser, no upload.",
    },
    convert: {
      title: "Image Converter – WebP, JPG, PNG, HEIC to JPG Free",
      desc: "Free online image converter: WebP to JPG, JPG and PNG to WebP, iPhone HEIC to JPG. Batch convert many images and download as ZIP. No upload.",
    },
    compress: {
      title: "Compress Image to 100KB, 1MB – Free Online",
      desc: "Compress JPG, PNG and WebP images online for free. Pick a quality or set a target size like 100KB, 200KB or 1MB. Bulk compress, no upload.",
    },
    resize: {
      title: "Resize Image Online Free – Without Losing Quality",
      desc: "Resize images by pixels or percent while keeping the aspect ratio. Bulk resize, Instagram and YouTube presets, free and right in your browser.",
    },
    allin: {
      title: "Bulk Image Converter, Compressor & Resizer",
      desc: "Compress, convert to WebP or JPG and resize in one step. A free bulk image tool that leaves unset options untouched. No upload.",
    },
    topdf: {
      title: "JPG to PDF Converter – Combine Images Free",
      desc: "Convert JPG and PNG to PDF for free and merge multiple images into one PDF in order. A4 fit and margins, no upload, no sign-up.",
    },
    pdfimg: {
      title: "PDF to JPG Converter – Free, High Quality",
      desc: "Convert every PDF page to high-quality JPG or PNG images for free and download them as a ZIP. No software, no upload.",
    },
    crop: {
      title: "Crop Image Online Free – Crop & Rotate Photos",
      desc: "Crop images online, rotate 90° and flip. Grid and center guides for precise crops, bulk apply to many photos. Free, no upload.",
    },
    wm: {
      title: "Add Watermark to Photos Online Free – Bulk",
      desc: "Add a text or logo watermark to photos for free. Adjust position, size and opacity and watermark photos in bulk. No upload.",
    },
    mask: {
      title: "Blur & Pixelate Image Online – Hide Faces",
      desc: "Blur or pixelate faces, license plates and addresses in photos. Select multiple areas, free, and images never leave your device.",
    },
    bg: {
      title: "Remove Background from Image Free – AI",
      desc: "Remove image backgrounds automatically with AI and get a transparent PNG. Free, no sign-up, processed right in your browser.",
    },
    ocr: {
      title: "Image to Text Converter Free – OCR Online",
      desc: "Extract text from images and screenshots and copy it instantly. Free OCR for English, Korean and Japanese, no upload.",
    },
    fav: {
      title: "Favicon Generator from Image – ICO & PNG Free",
      desc: "Generate favicon.ico, 16–512px PNGs and Apple touch icons from one image for free. Download the full favicon set as ZIP.",
    },
    privacy: {
      title: "Privacy Policy",
      desc: "How Usepic handles your data: images are processed in your browser and never uploaded. Learn which cookies and analytics we use.",
    },
  },
  ja: {
    home: {
      title: "無料 画像変換・圧縮・サイズ変更ツール | Usepic",
      desc: "WebP・JPG・PNG・HEICの変換、画像圧縮、サイズ変更、背景削除まで12種類の画像ツールを無料で。アップロード不要、ブラウザですぐ処理。",
    },
    convert: {
      title: "画像変換 - WebP・JPG・PNG・HEIC 無料変換",
      desc: "WebPをJPGに、JPG・PNGをWebPに、iPhoneのHEICをJPGに無料で変換。複数枚を一括変換してZIPで保存できます。",
    },
    compress: {
      title: "画像圧縮 - 無料・一括で容量を削減",
      desc: "JPG・PNG・WebP画像を無料で圧縮。画質を選ぶか、100KBなど目標サイズを指定。一括圧縮対応、アップロード不要。",
    },
    resize: {
      title: "画像サイズ変更 - 画質そのまま一括リサイズ",
      desc: "ピクセル・比率で画像サイズを変更。縦横比を保ったまま一括リサイズ、Instagram・YouTube用プリセットも。無料。",
    },
    allin: {
      title: "画像 一括変換・圧縮・リサイズ",
      desc: "圧縮、WebP・JPG変換、サイズ変更をまとめて適用できる無料の一括画像処理ツール。複数枚も一度に。",
    },
    topdf: {
      title: "画像 PDF 変換 - JPGを1つのPDFにまとめる",
      desc: "JPG・PNG画像を順番どおり1つのPDFに無料変換。A4フィット・余白設定、アップロード不要で書類提出にも。",
    },
    pdfimg: {
      title: "PDF JPG 変換 - 無料・高画質",
      desc: "PDFの各ページを高画質なJPG・PNG画像に無料変換し、ZIPでまとめてダウンロード。ソフトのインストール不要。",
    },
    crop: {
      title: "画像トリミング・回転 - 無料オンライン",
      desc: "画像を好きな範囲でトリミングし、90°回転・反転も。グリッドと中央ガイドで正確に、一括適用も可能です。",
    },
    wm: {
      title: "画像に透かしを入れる - 無料・一括",
      desc: "テキストやロゴで画像に透かしを無料で入れられます。位置・サイズ・透明度を調整し、複数枚に一括挿入。",
    },
    mask: {
      title: "画像モザイク・ぼかし - 顔や個人情報を隠す",
      desc: "顔・ナンバープレート・住所などをモザイクやぼかしで隠せます。複数範囲を指定可能、画像は送信されず安全。",
    },
    bg: {
      title: "背景削除 - 無料AIで画像の背景を透過",
      desc: "AIが画像の背景を自動で削除し、透過PNGを作成します。無料・登録不要、ブラウザ上で処理されます。",
    },
    ocr: {
      title: "画像 文字起こし - 無料OCRでテキスト抽出",
      desc: "画像やスクリーンショットの文字をテキストとして抽出し、すぐにコピー。日本語・英語・韓国語OCR、無料。",
    },
    fav: {
      title: "ファビコン作成ツール - ICO・PNG 無料",
      desc: "画像1枚からfavicon.ico、16〜512pxのPNG、Appleタッチアイコンまで無料で作成し、ZIPでダウンロード。",
    },
    privacy: {
      title: "プライバシーポリシー",
      desc: "Usepicの個人情報の取り扱い。画像はブラウザ内で処理されサーバーに送信されません。Cookieと分析ツールについて説明します。",
    },
  },
  zh: {
    home: {
      title: "免费图片格式转换·压缩·尺寸修改工具 | Usepic",
      desc: "WebP、JPG、PNG、HEIC格式转换，图片压缩，尺寸修改，在线抠图等12款免费图片工具。无需上传，浏览器内直接处理。",
    },
    convert: {
      title: "图片格式转换 - WebP/JPG/PNG/HEIC在线转换",
      desc: "免费在线图片格式转换：WebP转JPG、JPG/PNG转WebP、iPhone HEIC转JPG。支持批量转换并打包ZIP下载。",
    },
    compress: {
      title: "图片压缩 - 免费在线压缩图片大小",
      desc: "免费在线压缩JPG、PNG、WebP图片大小。可选画质或指定目标大小（如100KB），支持批量压缩，无需上传。",
    },
    resize: {
      title: "图片尺寸修改 - 在线调整图片大小",
      desc: "按像素或比例在线修改图片尺寸，保持原始比例，支持批量修改和常用社交平台尺寸预设，免费使用。",
    },
    allin: {
      title: "图片批量压缩·转换·改尺寸",
      desc: "一次完成压缩、WebP/JPG格式转换和尺寸修改的免费批量图片处理工具，多张图片一键处理。",
    },
    topdf: {
      title: "JPG转PDF - 多张图片合并为PDF",
      desc: "免费将JPG、PNG图片按顺序合并转换为一个PDF。支持A4适配和边距设置，无需上传。",
    },
    pdfimg: {
      title: "PDF转JPG - 免费在线高清转换",
      desc: "免费将PDF每一页转换为高清JPG或PNG图片，并打包ZIP下载，无需安装软件。",
    },
    crop: {
      title: "图片裁剪 - 在线裁剪与旋转图片",
      desc: "在线裁剪图片，支持90°旋转和翻转，网格与居中辅助线精准裁剪，可批量应用。免费、无需上传。",
    },
    wm: {
      title: "图片加水印 - 在线免费批量添加",
      desc: "免费为图片添加文字或Logo水印，可调整位置、大小和透明度，支持批量添加，无需上传。",
    },
    mask: {
      title: "图片打码 - 在线马赛克与模糊处理",
      desc: "为人脸、车牌、地址等隐私信息打码或模糊处理，可选择多个区域，图片不会上传，安全免费。",
    },
    bg: {
      title: "在线抠图 - 免费AI一键去背景",
      desc: "AI自动去除图片背景，生成透明背景PNG。免费抠图，无需注册，在浏览器中直接处理。",
    },
    ocr: {
      title: "图片转文字 - 免费在线OCR识别",
      desc: "在线识别图片和截图中的文字并一键复制，支持英文、日文、韩文OCR，免费且无需上传。",
    },
    fav: {
      title: "Favicon生成器 - 在线生成ICO图标",
      desc: "用一张图片免费生成favicon.ico、16–512px PNG和Apple触控图标，整套打包ZIP下载。",
    },
    privacy: {
      title: "隐私政策",
      desc: "Usepic如何处理您的信息：图片在浏览器中处理，不会上传到服务器。并说明Cookie与分析工具的使用。",
    },
  },
  "zh-TW": {
    home: {
      title: "免費圖片轉檔·壓縮·縮小工具 | Usepic",
      desc: "WebP、JPG、PNG、HEIC轉檔，圖片壓縮、縮小尺寸、線上去背等12款免費圖片工具。不需上傳，瀏覽器中直接處理。",
    },
    convert: {
      title: "圖片轉檔 - WebP/JPG/PNG/HEIC線上免費轉換",
      desc: "免費線上圖片轉檔：WebP轉JPG、JPG/PNG轉WebP、iPhone HEIC轉JPG。支援批次轉換並打包ZIP下載。",
    },
    compress: {
      title: "圖片壓縮 - 免費線上縮小檔案大小",
      desc: "免費線上壓縮JPG、PNG、WebP圖片，可選畫質或指定大小（如100KB），不失真批次壓縮，不需上傳。",
    },
    resize: {
      title: "圖片縮小 - 線上調整圖片尺寸",
      desc: "依像素或比例縮小圖片尺寸並保持原比例，支援批次調整與社群平台尺寸預設，免費使用。",
    },
    allin: {
      title: "圖片批次壓縮·轉檔·縮小",
      desc: "一次完成壓縮、WebP/JPG轉檔與尺寸調整的免費批次圖片處理工具，多張圖片一次搞定。",
    },
    topdf: {
      title: "JPG轉PDF - 多張圖片合併成PDF",
      desc: "免費將JPG、PNG圖片依序合併轉換成一個PDF。支援A4縮放與邊界設定，高畫質且不需上傳。",
    },
    pdfimg: {
      title: "PDF轉JPG - 免費線上高畫質轉換",
      desc: "免費將PDF每一頁轉換為高畫質JPG或PNG圖片，並打包ZIP下載，不需安裝軟體。",
    },
    crop: {
      title: "圖片裁切 - 線上裁切與旋轉圖片",
      desc: "線上裁切圖片，支援90°旋轉與翻轉，格線與置中輔助線精準裁切，可批次套用。免費、不需上傳。",
    },
    wm: {
      title: "浮水印製作 - 線上免費批次加浮水印",
      desc: "免費為圖片加上文字或Logo浮水印，可調整位置、大小與透明度，支援批次加入，不需上傳。",
    },
    mask: {
      title: "圖片馬賽克 - 線上打碼與模糊處理",
      desc: "為人臉、車牌、地址等個資加上馬賽克或模糊處理，可選多個區域，圖片不會上傳，安全免費。",
    },
    bg: {
      title: "線上去背 - 免費AI一鍵去背景",
      desc: "AI自動去除圖片背景，產生透明背景PNG。免費去背，不需註冊，在瀏覽器中直接處理。",
    },
    ocr: {
      title: "圖片轉文字 - 免費線上OCR辨識",
      desc: "線上辨識圖片與截圖中的文字並一鍵複製，支援英文、日文、韓文OCR，免費且不需上傳。",
    },
    fav: {
      title: "Favicon產生器 - 線上產生ICO圖示",
      desc: "用一張圖片免費產生favicon.ico、16–512px PNG與Apple觸控圖示，整套打包ZIP下載。",
    },
    privacy: {
      title: "隱私權政策",
      desc: "Usepic如何處理您的資料：圖片在瀏覽器中處理，不會上傳到伺服器。並說明Cookie與分析工具的使用。",
    },
  },
  id: {
    home: {
      title: "Ubah Format, Kompres & Ubah Ukuran Gambar Gratis | Usepic",
      desc: "Ubah WebP, JPG, PNG, HEIC, kompres foto jadi 200KB atau 1 MB, ubah ukuran, crop dan hapus background — 12 alat gambar gratis di browser, tanpa unggah.",
    },
    convert: {
      title: "Ubah Format Gambar ke JPG, PNG, WebP – Gratis",
      desc: "Ubah format gambar gratis: WebP ke JPG, JPG/PNG ke WebP, HEIC iPhone ke JPG. Konversi banyak gambar sekaligus dan unduh ZIP.",
    },
    compress: {
      title: "Kompres Foto Online Gratis – Jadi 200KB, 1 MB",
      desc: "Kompres foto dan gambar JPG, PNG, WebP online gratis. Pilih kualitas atau tentukan ukuran seperti 200KB, 500KB, 1 MB. Massal, tanpa unggah.",
    },
    resize: {
      title: "Ubah Ukuran Foto Online Gratis – Tanpa Pecah",
      desc: "Ubah ukuran foto dalam piksel atau persen dengan rasio tetap. Ubah banyak foto sekaligus, preset Instagram dan YouTube, gratis di browser.",
    },
    allin: {
      title: "Kompres, Ubah Format & Ukuran Gambar Sekaligus",
      desc: "Kompres, ubah ke WebP atau JPG, dan ubah ukuran dalam satu langkah. Alat gambar massal gratis, tanpa unggah.",
    },
    topdf: {
      title: "JPG ke PDF – Gabung Banyak Foto Jadi PDF",
      desc: "Ubah JPG dan PNG ke PDF gratis dan gabungkan banyak foto menjadi satu PDF sesuai urutan. Pas A4, atur margin, tanpa unggah.",
    },
    pdfimg: {
      title: "PDF ke JPG Online Gratis – Kualitas HD",
      desc: "Ubah setiap halaman PDF menjadi gambar JPG atau PNG berkualitas HD secara gratis dan unduh dalam satu ZIP. Tanpa aplikasi.",
    },
    crop: {
      title: "Crop Foto Online Gratis – Potong & Putar",
      desc: "Crop foto online, putar 90° dan balik. Garis bantu grid dan tengah untuk potongan presisi, bisa untuk banyak foto. Gratis.",
    },
    wm: {
      title: "Watermark Foto Online Gratis – Massal",
      desc: "Tambahkan watermark teks atau logo ke foto secara gratis. Atur posisi, ukuran, dan transparansi, untuk banyak foto sekaligus.",
    },
    mask: {
      title: "Blur Foto Online Gratis – Sensor Wajah",
      desc: "Blur atau pikselkan wajah, plat nomor, dan alamat di foto. Pilih beberapa area, gratis, foto tidak pernah dikirim ke server.",
    },
    bg: {
      title: "Hapus Background Foto Gratis – HD dengan AI",
      desc: "Hapus background foto otomatis dengan AI dan dapatkan PNG transparan. Gratis, tanpa daftar, diproses langsung di browser.",
    },
    ocr: {
      title: "Gambar ke Teks Gratis – OCR Online",
      desc: "Ambil teks dari gambar dan screenshot lalu salin seketika. OCR gratis untuk Inggris, Korea, dan Jepang, tanpa unggah.",
    },
    fav: {
      title: "Favicon Generator dari Gambar – ICO & PNG",
      desc: "Buat favicon.ico, PNG 16–512px, dan ikon Apple touch dari satu gambar secara gratis. Unduh satu set lengkap dalam ZIP.",
    },
    privacy: {
      title: "Kebijakan Privasi",
      desc: "Cara Usepic menangani data Anda: gambar diproses di browser dan tidak pernah diunggah. Penjelasan cookie dan alat analitik.",
    },
  },
  th: {
    home: {
      title: "แปลงไฟล์รูป ลดขนาดรูป ปรับขนาดรูป ฟรี | Usepic",
      desc: "แปลง WebP JPG PNG HEIC ลดขนาดรูปภาพ ปรับขนาด ครอปรูป และลบพื้นหลัง รวม 12 เครื่องมือฟรี ทำงานในเบราว์เซอร์ ไม่ต้องอัปโหลด",
    },
    convert: {
      title: "แปลงไฟล์รูปเป็น JPG PNG WebP ฟรี",
      desc: "แปลงไฟล์รูปออนไลน์ฟรี: WebP เป็น JPG, JPG/PNG เป็น WebP, HEIC จาก iPhone เป็น JPG แปลงหลายไฟล์พร้อมกันและดาวน์โหลด ZIP",
    },
    compress: {
      title: "ลดขนาดรูปภาพ ย่อไฟล์รูปออนไลน์ฟรี",
      desc: "ลดขนาดรูปภาพ JPG PNG WebP ฟรี เลือกคุณภาพหรือกำหนดขนาดไฟล์ เช่น ไม่เกิน 1 MB ลดหลายรูปพร้อมกัน ไม่ต้องอัปโหลด",
    },
    resize: {
      title: "ปรับขนาดรูปภาพ ย่อขนาดรูปให้เล็กลง ฟรี",
      desc: "ปรับขนาดรูปเป็นพิกเซลหรือเปอร์เซ็นต์โดยคงสัดส่วน ปรับหลายรูปพร้อมกัน มีขนาดสำเร็จสำหรับ Instagram และ YouTube ฟรี",
    },
    allin: {
      title: "ลดขนาด แปลงไฟล์ และปรับขนาดรูปในครั้งเดียว",
      desc: "ลดขนาดรูป แปลงเป็น WebP หรือ JPG และปรับขนาดในขั้นตอนเดียว เครื่องมือจัดการรูปหลายไฟล์ฟรี ไม่ต้องอัปโหลด",
    },
    topdf: {
      title: "แปลง JPG เป็น PDF รวมหลายรูปเป็นไฟล์เดียว ฟรี",
      desc: "แปลงรูป JPG PNG เป็น PDF ฟรี รวมหลายรูปเป็น PDF ไฟล์เดียวตามลำดับ ปรับพอดี A4 และระยะขอบได้ ไม่ต้องอัปโหลด",
    },
    pdfimg: {
      title: "แปลง PDF เป็น JPG ฟรี คุณภาพสูง",
      desc: "แปลง PDF ทุกหน้าเป็นรูป JPG หรือ PNG คุณภาพสูงฟรี และดาวน์โหลดรวมเป็น ZIP ไม่ต้องติดตั้งโปรแกรม",
    },
    crop: {
      title: "ครอปรูปออนไลน์ฟรี ตัดและหมุนรูป",
      desc: "ครอปรูปออนไลน์ หมุน 90° และพลิกรูปได้ มีเส้นตารางและเส้นกึ่งกลางช่วยให้ตัดแม่นยำ ใช้กับหลายรูปได้ ฟรี",
    },
    wm: {
      title: "ใส่ลายน้ำในรูปภาพ ฟรี ทีละหลายรูป",
      desc: "ใส่ลายน้ำข้อความหรือโลโก้ในรูปภาพฟรี ปรับตำแหน่ง ขนาด และความโปร่งใส ใส่หลายรูปพร้อมกัน ไม่ต้องอัปโหลด",
    },
    mask: {
      title: "เบลอรูปเฉพาะจุด ใส่โมเสกปิดหน้า ฟรี",
      desc: "เบลอหรือใส่โมเสกปิดใบหน้า ทะเบียนรถ และที่อยู่ในรูป เลือกได้หลายจุด ฟรี และรูปไม่ถูกส่งไปที่เซิร์ฟเวอร์",
    },
    bg: {
      title: "ลบพื้นหลังรูปฟรี ด้วย AI ได้ PNG โปร่งใส",
      desc: "ลบพื้นหลังรูปอัตโนมัติด้วย AI ได้ไฟล์ PNG พื้นหลังโปร่งใส ฟรี ไม่ต้องสมัคร ประมวลผลในเบราว์เซอร์",
    },
    ocr: {
      title: "แปลงรูปเป็นข้อความ ฟรี OCR ออนไลน์",
      desc: "ดึงข้อความจากรูปภาพและภาพหน้าจอแล้วคัดลอกได้ทันที OCR ฟรีสำหรับภาษาอังกฤษ เกาหลี และญี่ปุ่น ไม่ต้องอัปโหลด",
    },
    fav: {
      title: "สร้าง favicon ออนไลน์ ICO และ PNG ฟรี",
      desc: "สร้าง favicon.ico, PNG 16–512px และไอคอน Apple touch จากรูปเดียวฟรี ดาวน์โหลดครบชุดเป็น ZIP",
    },
    privacy: {
      title: "นโยบายความเป็นส่วนตัว",
      desc: "วิธีที่ Usepic จัดการข้อมูลของคุณ รูปภาพประมวลผลในเบราว์เซอร์และไม่ถูกอัปโหลด พร้อมอธิบายการใช้คุกกี้และเครื่องมือวิเคราะห์",
    },
  },
  ru: {
    home: {
      title: "Конвертер, сжатие и изменение размера фото онлайн | Usepic",
      desc: "Конвертируйте WebP, JPG, PNG, HEIC, сжимайте фото до 1 МБ, меняйте размер, обрезайте и удаляйте фон — 12 бесплатных инструментов в браузере без загрузки.",
    },
    convert: {
      title: "Конвертер изображений в JPG, PNG, WebP онлайн",
      desc: "Бесплатный конвертер изображений: WebP в JPG, JPG и PNG в WebP, HEIC с iPhone в JPG. Пакетная конвертация и скачивание ZIP.",
    },
    compress: {
      title: "Сжать фото онлайн бесплатно – до 1 МБ",
      desc: "Сжимайте фото JPG, PNG и WebP онлайн без потери качества. Выберите качество или нужный размер — 500 КБ, 1 МБ, 2 МБ. Пакетно, без загрузки.",
    },
    resize: {
      title: "Изменить размер фото онлайн в пикселях",
      desc: "Меняйте размер фото в пикселях или процентах с сохранением пропорций. Пакетная обработка, пресеты для Instagram и YouTube, бесплатно.",
    },
    allin: {
      title: "Сжатие, конвертация и изменение размера сразу",
      desc: "Сжимайте, конвертируйте в WebP или JPG и меняйте размер за один шаг. Бесплатный пакетный редактор изображений без загрузки.",
    },
    topdf: {
      title: "JPG в PDF онлайн – объединить фото в PDF",
      desc: "Бесплатно конвертируйте JPG и PNG в PDF и объединяйте несколько фото в один файл по порядку. Подгонка под A4, поля, без загрузки.",
    },
    pdfimg: {
      title: "PDF в JPG онлайн бесплатно – высокое качество",
      desc: "Конвертируйте каждую страницу PDF в JPG или PNG высокого качества бесплатно и скачайте ZIP-архивом. Без программ.",
    },
    crop: {
      title: "Обрезать фото онлайн бесплатно – и повернуть",
      desc: "Обрезайте фото онлайн, поворачивайте на 90° и отражайте. Сетка и центральные направляющие, пакетная обработка. Бесплатно.",
    },
    wm: {
      title: "Водяной знак на фото онлайн бесплатно",
      desc: "Добавляйте текстовый водяной знак или логотип на фото бесплатно. Позиция, размер и прозрачность, пакетно для многих фото.",
    },
    mask: {
      title: "Размыть фото онлайн – скрыть лицо и номер",
      desc: "Размывайте или пикселизируйте лица, номера машин и адреса на фото. Несколько областей, бесплатно, фото не покидают устройство.",
    },
    bg: {
      title: "Удалить фон с фото онлайн бесплатно – AI",
      desc: "AI автоматически удаляет фон с фото и создаёт PNG с прозрачным фоном. Бесплатно, без регистрации, прямо в браузере.",
    },
    ocr: {
      title: "Распознать текст с картинки онлайн бесплатно",
      desc: "Извлекайте текст с картинок и скриншотов и сразу копируйте. Бесплатное OCR для английского, корейского и японского, без загрузки.",
    },
    fav: {
      title: "Генератор favicon всех размеров – ICO и PNG",
      desc: "Создайте favicon.ico, PNG 16–512 px и иконки Apple touch из одного изображения бесплатно. Полный набор в ZIP.",
    },
    privacy: {
      title: "Политика конфиденциальности",
      desc: "Как Usepic обращается с данными: изображения обрабатываются в браузере и не загружаются. Какие cookie и аналитику мы используем.",
    },
  },
};

export function seoFor(locale: Locale, page: SeoPage, fallback: SeoText): SeoText {
  return seoMeta[locale]?.[page] ?? fallback;
}

/** pageMetadata 의 title/description 인자로 펼쳐 쓰는 형태 */
export function seoMetadataText(locale: Locale, page: SeoPage, dict: SeoText): { title: string; description: string } {
  const t = seoFor(locale, page, dict);
  return { title: t.title, description: t.desc };
}
