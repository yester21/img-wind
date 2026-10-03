export default function ToolHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <section className="text-center pt-2 pb-8">
      <h1 className="text-[40px] font-semibold tracking-tight text-ink">{title}</h1>
      <p className="mt-2.5 text-[19px] text-muted max-w-lg mx-auto leading-relaxed">{desc}</p>
    </section>
  );
}
