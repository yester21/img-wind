import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "유스픽의 개인정보처리방침입니다. 이미지 파일은 서버로 전송되지 않습니다.",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. 처리하는 개인정보 항목",
    body: [
      "문의하기를 통해 이용자가 직접 입력한 이름, 이메일 주소, 문의 내용을 수집합니다.",
      "서비스 이용 과정에서 이미지 파일 및 그 내용은 수집하지 않습니다. 모든 이미지 처리는 이용자의 브라우저에서만 이뤄지고 서버로 전송되지 않습니다.",
    ],
  },
  {
    title: "2. 개인정보의 처리 목적",
    body: ["문의 응대 및 회신, 서비스 오류 확인과 개선, 제휴·협업 문의 대응을 위해 사용합니다."],
  },
  {
    title: "3. 보관 기간",
    body: ["문의 응대 완료 후 1년간 보관하며, 기간이 지나면 지체 없이 파기합니다. 이용자가 삭제를 요청하면 즉시 파기합니다."],
  },
  {
    title: "4. 제3자 제공",
    body: ["이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 따라 요구되는 경우에는 예외로 합니다."],
  },
  {
    title: "5. 쿠키 및 광고",
    body: [
      "서비스는 언어 설정 등 편의 기능을 위해 브라우저 저장소(쿠키·로컬 스토리지)를 사용할 수 있습니다.",
      "향후 광고 서비스가 도입되는 경우, 광고 사업자가 쿠키를 사용할 수 있으며 관련 내용은 본 방침에 사전 고지합니다.",
    ],
  },
  {
    title: "6. 이용자의 권리",
    body: ["이용자는 언제든지 자신의 개인정보 열람·정정·삭제를 요청할 수 있으며, 문의하기를 통해 요청할 수 있습니다."],
  },
  {
    title: "7. 문의처",
    body: ["개인정보 관련 문의는 문의하기 페이지를 통해 접수해 주시면 확인 후 회신드리겠습니다."],
  },
];

export default function PrivacyPage() {
  return (
    <div className="break-keep">
      <section className="pt-4 pb-8">
        <p className="text-[14px] font-medium text-primary">개인정보처리방침</p>
        <h1 className="mt-2 text-[40px] font-semibold tracking-tight text-ink">개인정보처리방침</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-muted">
          유스픽은 이용자의 개인정보를 소중히 다루며, 아래와 같이 처리 방침을 안내합니다. 시행일: 2026년 11월 1일
        </p>
      </section>
      <div className="space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="text-[20px] font-semibold text-ink">{s.title}</h2>
            <div className="mt-2 space-y-2">
              {s.body.map((p) => (
                <p key={p} className="text-[16px] leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-[14px] text-muted">
        문의: <a href="/ko/contact" className="text-primary hover:underline">문의하기 페이지</a>
      </p>
    </div>
  );
}
