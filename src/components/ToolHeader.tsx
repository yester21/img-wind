export default function ToolHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <section className="text-center pt-2 pb-8">
      <h1 className="text-[34px] sm:text-[40px] font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-2.5 text-[20px] text-muted max-w-[560px] mx-auto leading-relaxed break-keep text-balance">{desc}</p>
    </section>
  );
}
