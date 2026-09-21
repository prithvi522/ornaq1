const brandNameParts = [
  {
    label: "OR",
    title: "Ornament",
    desc: "Rooted in ornament, directly signalling jewellery, decoration, and beauty so adornment is the first feeling the name creates."
  },
  {
    label: "NA",
    title: "Nari / Naari",
    desc: "Hidden inside the name, nari means woman in Hindi and Marathi, giving ORNAQ a deeper cultural resonance with its core audience."
  },
  {
    label: "Q",
    title: "Quality / Queen",
    desc: "The Q adds modernity, exclusivity, and edge while positioning every customer as the queen of her own story."
  }
];

const brandPillars = [
  {
    title: "Heritage",
    desc: "Rooted in Maharashtra's textile and jewellery traditions, drawing from Paithani, Kolhapuri, and beyond."
  },
  {
    title: "Elegance",
    desc: "Every piece is curated to make the modern Indian woman feel confident, graceful, and beautiful."
  },
  {
    title: "Convenience",
    desc: "Online-first and delivered to your door, with shopping kept simple for the busy Indian woman."
  },
  {
    title: "Trust",
    desc: "Authentic products, transparent pricing, easy returns, and care built one customer at a time."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fffdf9] pb-20">
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.45em] text-brand-700">Brand Identity</p>
              <h1 className="mt-4 text-4xl font-black tracking-tighter text-stone-900 sm:text-6xl">A short name with deep cultural resonance.</h1>
            </div>
            <div className="space-y-5 text-sm font-medium leading-relaxed text-stone-600 sm:text-base">
              <p>ORNAQ is a coined brand name: short, distinctive, and memorable. It blends ornament, nari, and quality into one word, connecting sarees and jewellery with beauty, culture, and self-expression.</p>
              <p>Born in Maharashtra, it is designed to feel premium, easy to remember, and flexible enough to grow across sarees, jewellery, and the wider world of adornment.</p>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {brandNameParts.map((part) => (
              <div key={part.label} className="rounded-lg border border-stone-100 bg-[#fffdf9] p-6 shadow-lg shadow-stone-200/40">
                <p className="text-5xl font-black tracking-tighter text-brand-700">{part.label}</p>
                <h2 className="mt-5 text-2xl font-black text-stone-900">{part.title}</h2>
                <p className="mt-3 text-sm font-medium leading-relaxed text-stone-500">{part.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6 sm:mt-32 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-brand-700">Official Brand Copy</p>
            <h2 className="mt-4 text-4xl font-black tracking-tighter text-stone-900 sm:text-6xl">From Maharashtra, for every Indian woman.</h2>
          </div>
          <div className="rounded-lg border border-stone-100 bg-white p-8 shadow-xl shadow-stone-200/50">
            <p className="text-lg font-semibold leading-relaxed text-stone-800">ORNAQ is an online destination for Indian women who want to celebrate their beauty through the timeless elegance of sarees and jewellery.</p>
            <p className="mt-5 text-sm font-medium leading-relaxed text-stone-500 sm:text-base">Born in Maharashtra, we bring handpicked collections that blend cultural tradition with modern design for weddings, festivals, and every precious moment in between.</p>
            <p className="mt-5 text-sm font-medium leading-relaxed text-stone-500 sm:text-base">From the silk drapes of Paithani to the shimmer of everyday jewellery, ORNAQ is where you find pieces that feel like they were made for you.</p>
            <p className="mt-5 text-sm font-medium leading-relaxed text-stone-500 sm:text-base">We believe a saree is more than fabric. It is memory, identity, and grace woven into six yards. Jewellery is the language a woman speaks when words are not enough.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6 sm:mt-32 sm:px-8">
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.45em] text-brand-700">Core Brand Pillars</p>
          <h2 className="mt-4 text-4xl font-black tracking-tighter text-stone-900 sm:text-6xl">Heritage, elegance, convenience, trust.</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {brandPillars.map((pillar) => (
            <div key={pillar.title} className="rounded-lg border border-stone-100 bg-white p-6 shadow-lg shadow-stone-200/40">
              <h2 className="text-2xl font-black text-stone-900">{pillar.title}</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-stone-500">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}