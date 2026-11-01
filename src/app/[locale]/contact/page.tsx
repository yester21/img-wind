import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "문의하기",
  description: "유스픽 서비스 문의, 버그 신고, 제휴 제안을 보내주세요.",
};

export default function ContactPage() {
  return (
    <div className="break-keep">
      <section className="pt-4 pb-10 text-center">
        <p className="text-[14px] font-medium text-primary">문의하기</p>
        <h1 className="mt-2 text-[40px] font-semibold tracking-tight text-ink">무엇이든 물어보세요</h1>
        <p className="mt-3 text-[20px] leading-relaxed text-muted max-w-xl mx-auto">
          서비스 이용, 버그 신고, 제휴 제안을 남겨주시면 확인 후 회신드리겠습니다.
        </p>
      </section>
      <div className="mx-auto max-w-2xl">
        <ContactForm />
        <p className="mt-5 text-center text-[14px] text-muted">
          이미지 처리 관련 문의는 대부분 <a href="/ko/about#faq" className="text-primary hover:underline">자주 묻는 질문</a>에서 해결할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
