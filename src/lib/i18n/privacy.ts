import type { Locale } from "./config";

export type PrivacySection = { t: string; b: string[] };
export type PrivacyText = {
  kicker: string;
  title: string;
  updated: string;
  sections: PrivacySection[];
  contactLabel: string;
  contactNote: string;
};

export const privacyContent: Record<Locale, PrivacyText> = {
  ko: {
    kicker: "개인정보처리방침",
    title: "개인정보처리방침",
    updated: "시행일: 2026년 11월 1일",
    sections: [
      { t: "1. 처리하는 개인정보 항목", b: ["문의하기를 통해 이용자가 직접 입력한 이름, 이메일 주소, 문의 내용을 수집합니다.", "서비스 이용 과정에서 이미지 파일 및 그 내용은 수집하지 않습니다. 모든 이미지 처리는 이용자의 브라우저에서만 이뤄지고 서버로 전송되지 않습니다."] },
      { t: "2. 개인정보의 처리 목적", b: ["문의 응대 및 회신, 서비스 오류 확인과 개선, 제휴·협업 문의 대응을 위해 사용합니다."] },
      { t: "3. 보관 기간", b: ["문의 응대 완료 후 1년간 보관하며, 기간이 지나면 지체 없이 파기합니다."] },
      { t: "4. 제3자 제공", b: ["이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 따라 요구되는 경우에는 예외로 합니다."] },
      { t: "5. 쿠키 및 광고", b: ["언어 설정 등 편의 기능을 위해 브라우저 저장소(쿠키·로컬 스토리지)를 사용할 수 있습니다.", "향후 광고 서비스가 도입되는 경우 관련 내용을 본 방침에 사전 고지합니다.\n분석 도구(Google Analytics)는 동의한 경우에만 사용하며, 푸터의 '쿠키 설정'에서 언제든 철회할 수 있습니다."] },
      { t: "6. 이용자의 권리", b: ["이용자는 자신의 개인정보 열람·정정·삭제를 언제든지 요청할 수 있으며, 문의하기를 통해 접수할 수 있습니다."] },
      { t: "7. 문의처", b: ["개인정보 관련 문의는 문의하기 페이지를 통해 접수해 주시면 확인 후 회신드리겠습니다."] },
    ],
    contactLabel: "문의하기 페이지",
    contactNote: "개인정보 관련 문의:",
  },
  en: {
    kicker: "Privacy policy",
    title: "Privacy policy",
    updated: "Effective: November 1, 2026",
    sections: [
      { t: "1. Information we collect", b: ["When you use the contact form we collect the name, email address and message you provide.", "We never collect your image files. All image processing happens in your browser and files are never uploaded."] },
      { t: "2. Purpose", b: ["We use the information to reply to inquiries, investigate and improve the service, and respond to partnership requests."] },
      { t: "3. Retention", b: ["Inquiry data is kept for one year after the request is resolved and then deleted."] },
      { t: "4. Third parties", b: ["We do not share your personal information with third parties, except where required by law."] },
      { t: "5. Cookies and ads", b: ["We may use browser storage (cookies, local storage) for preferences such as language.", "If advertising is introduced, this policy will be updated in advance.\nAnalytics (Google Analytics) is used only with your consent and can be withdrawn at any time via 'Cookie settings' in the footer."] },
      { t: "6. Your rights", b: ["You may request access, correction or deletion of your personal information at any time via the contact form."] },
      { t: "7. Contact", b: ["For privacy questions, please contact us through the contact page and we will reply."] },
    ],
    contactLabel: "Contact page",
    contactNote: "Privacy inquiries:",
  },
  ja: {
    kicker: "プライバシーポリシー",
    title: "プライバシーポリシー",
    updated: "施行日: 2026年11月1日",
    sections: [
      { t: "1. 取得する個人情報", b: ["お問い合わせフォームで入力された氏名・メールアドレス・お問い合わせ内容を取得します。", "画像ファイルは取得しません。画像処理はすべてブラウザ内で行われ、サーバーに送信されません。"] },
      { t: "2. 利用目的", b: ["お問い合わせへの返信、不具合の確認・改善、提携のご提案への対応に利用します。"] },
      { t: "3. 保管期間", b: ["お問い合わせ対応完了後1年間保管し、その後は速やかに削除します。"] },
      { t: "4. 第三者提供", b: ["法令に基づく場合を除き、個人情報を第三者に提供しません。"] },
      { t: "5. Cookie と広告", b: ["言語設定などのためにブラウザストレージを使用する場合があります。", "広告を導入する場合は事前に本ポリシーで告知します。\n分析ツール（Google Analytics）は同意した場合のみ使用し、フッターの「Cookie 設定」からいつでも撤回できます。"] },
      { t: "6. 利用者の権利", b: ["ご自身の個人情報の開示・訂正・削除をいつでもお問い合わせフォームから請求できます。"] },
      { t: "7. お問い合わせ", b: ["個人情報に関するお問い合わせは、お問い合わせページからご連絡ください。"] },
    ],
    contactLabel: "お問い合わせページ",
    contactNote: "個人情報に関するお問い合わせ:",
  },
  zh: {
    kicker: "隐私政策",
    title: "隐私政策",
    updated: "生效日期：2026年11月1日",
    sections: [
      { t: "1. 我们收集的信息", b: ["通过联系表单收集您填写的姓名、邮箱和咨询内容。", "我们不会收集图片文件。所有图片处理均在浏览器内完成，不会上传服务器。"] },
      { t: "2. 使用目的", b: ["用于回复咨询、排查并改进服务、处理合作提案。"] },
      { t: "3. 保存期限", b: ["咨询处理完成后保存一年，之后及时删除。"] },
      { t: "4. 第三方提供", b: ["除法律要求外，我们不会向第三方提供您的个人信息。"] },
      { t: "5. Cookie 与广告", b: ["可能使用浏览器存储（Cookie、本地存储）保存语言偏好等设置。", "如引入广告服务，将提前在本政策中说明。\n分析工具（Google Analytics）仅在您同意后使用，可随时通过页脚的“Cookie 设置”撤回。"] },
      { t: "6. 用户权利", b: ["您可随时通过联系表单请求查阅、更正或删除个人信息。"] },
      { t: "7. 联系方式", b: ["隐私相关咨询请通过联系页面提交，我们会尽快回复。"] },
    ],
    contactLabel: "联系页面",
    contactNote: "隐私相关咨询：",
  },
  "zh-TW": {
    kicker: "隱私權政策",
    title: "隱私權政策",
    updated: "生效日期：2026年11月1日",
    sections: [
      { t: "1. 我們蒐集的資訊", b: ["透過聯絡表單蒐集您填寫的姓名、電子郵件與諮詢內容。", "我們不會蒐集圖片檔案。所有圖片處理均在瀏覽器內完成，不會上傳伺服器。"] },
      { t: "2. 使用目的", b: ["用於回覆諮詢、排查並改善服務、處理合作提案。"] },
      { t: "3. 保存期間", b: ["諮詢處理完成後保存一年，之後即時刪除。"] },
      { t: "4. 第三方提供", b: ["除法令要求外，我們不會向第三方提供您的個人資訊。"] },
      { t: "5. Cookie 與廣告", b: ["可能使用瀏覽器儲存（Cookie、本機儲存）保存語言偏好等設定。", "如引入廣告服務，將提前於本政策說明。\n分析工具（Google Analytics）僅在您同意後使用，可隨時透過頁尾的「Cookie 設定」撤回。"] },
      { t: "6. 使用者權利", b: ["您可隨時透過聯絡表單請求查閱、更正或刪除個人資訊。"] },
      { t: "7. 聯絡方式", b: ["隱私相關諮詢請透過聯絡頁面提交，我們會盡快回覆。"] },
    ],
    contactLabel: "聯絡頁面",
    contactNote: "隱私相關諮詢：",
  },
  id: {
    kicker: "Kebijakan privasi",
    title: "Kebijakan privasi",
    updated: "Berlaku: 1 November 2026",
    sections: [
      { t: "1. Informasi yang dikumpulkan", b: ["Melalui formulir kontak kami mengumpulkan nama, email dan pesan yang Anda isi.", "Kami tidak mengumpulkan file gambar. Semua pemrosesan terjadi di browser dan tidak diunggah."] },
      { t: "2. Tujuan", b: ["Untuk membalas pertanyaan, memperbaiki layanan dan menanggapi permintaan kerja sama."] },
      { t: "3. Penyimpanan", b: ["Data pertanyaan disimpan satu tahun setelah selesai ditangani lalu dihapus."] },
      { t: "4. Pihak ketiga", b: ["Kami tidak membagikan informasi pribadi kepada pihak ketiga kecuali diwajibkan hukum."] },
      { t: "5. Cookie dan iklan", b: ["Kami dapat menggunakan penyimpanan browser untuk preferensi bahasa.", "Jika iklan diperkenalkan, kebijakan ini akan diperbarui lebih dulu.\nAlat analitik (Google Analytics) hanya digunakan dengan persetujuan Anda dan dapat dicabut kapan saja melalui 'Pengaturan cookie' di footer."] },
      { t: "6. Hak Anda", b: ["Anda dapat meminta akses, koreksi atau penghapusan data kapan saja melalui formulir kontak."] },
      { t: "7. Kontak", b: ["Untuk pertanyaan privasi, hubungi kami melalui halaman kontak."] },
    ],
    contactLabel: "Halaman kontak",
    contactNote: "Pertanyaan privasi:",
  },
  th: {
    kicker: "นโยบายความเป็นส่วนตัว",
    title: "นโยบายความเป็นส่วนตัว",
    updated: "มีผลตั้งแต่: 1 พฤศจิกายน 2026",
    sections: [
      { t: "1. ข้อมูลที่เก็บรวบรวม", b: ["ผ่านแบบฟอร์มติดต่อ เราเก็บชื่อ อีเมล และข้อความที่คุณกรอก", "เราไม่เก็บไฟล์รูปภาพ การประมวลผลทั้งหมดเกิดในเบราว์เซอร์และไม่อัปโหลด"] },
      { t: "2. วัตถุประสงค์", b: ["เพื่อตอบกลับคำถาม ปรับปรุงบริการ และตอบข้อเสนอความร่วมมือ"] },
      { t: "3. ระยะเวลาจัดเก็บ", b: ["เก็บข้อมูลคำถามหนึ่งปีหลังดำเนินการเสร็จ แล้วลบออก"] },
      { t: "4. บุคคลที่สาม", b: ["เราไม่เปิดเผยข้อมูลส่วนบุคคลแก่บุคคลที่สาม เว้นแต่กฎหมายกำหนด"] },
      { t: "5. คุกกี้และโฆษณา", b: ["เราอาจใช้ที่เก็บข้อมูลของเบราว์เซอร์สำหรับการตั้งค่าภาษา", "หากมีบริการโฆษณา จะแจ้งล่วงหน้าในนโยบายนี้\nเครื่องมือวิเคราะห์ (Google Analytics) ใช้เมื่อได้รับความยินยอมเท่านั้น และเพิกถอนได้ทุกเมื่อผ่าน 'ตั้งค่าคุกกี้' ที่ส่วนท้าย"] },
      { t: "6. สิทธิของคุณ", b: ["คุณสามารถขอเข้าถึง แก้ไข หรือลบข้อมูลได้ทุกเมื่อผ่านแบบฟอร์มติดต่อ"] },
      { t: "7. ติดต่อ", b: ["สอบถามเรื่องความเป็นส่วนตัวได้ที่หน้าติดต่อเรา"] },
    ],
    contactLabel: "หน้าติดต่อ",
    contactNote: "สอบถามเรื่องความเป็นส่วนตัว:",
  },
  ru: {
    kicker: "Политика конфиденциальности",
    title: "Политика конфиденциальности",
    updated: "Действует с 1 ноября 2026 г.",
    sections: [
      { t: "1. Какие данные мы собираем", b: ["Через форму обратной связи мы собираем имя, адрес почты и текст сообщения.", "Мы не собираем файлы изображений. Вся обработка происходит в браузере."] },
      { t: "2. Цели обработки", b: ["Ответы на обращения, проверка и улучшение сервиса, ответы на предложения о сотрудничестве."] },
      { t: "3. Срок хранения", b: ["Данные обращения хранятся один год после решения и затем удаляются."] },
      { t: "4. Передача третьим лицам", b: ["Мы не передаём персональные данные третьим лицам, кроме случаев, предусмотренных законом."] },
      { t: "5. Cookie и реклама", b: ["Можем использовать хранилище браузера для настроек языка.", "При появлении рекламы политика будет обновлена заранее.\nАналитика (Google Analytics) используется только с вашего согласия; отозвать согласие можно через «Настройки cookie» в подвале сайта."] },
      { t: "6. Ваши права", b: ["Вы можете запросить доступ, исправление или удаление данных через форму обратной связи."] },
      { t: "7. Контакты", b: ["По вопросам конфиденциальности пишите через страницу контактов."] },
    ],
    contactLabel: "Страница контактов",
    contactNote: "Вопросы о конфиденциальности:",
  },
};
