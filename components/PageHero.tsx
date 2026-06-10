import Image from "next/image";

export default function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
  bgImage,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  bgImage?: string;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36">
      {/* Background image */}
      {bgImage && (
        <Image
          src={bgImage}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      )}
      {/* Overlays */}
      <div className="absolute inset-0 bg-navy-900/75" />
      <div className="absolute inset-0 grid-texture opacity-50" />
      <div className="absolute -right-32 -top-10 h-96 w-96 rounded-full bg-gold/10 blur-[110px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,48,110,0.5),transparent_60%)]" />
      <div className="container-luxe relative">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.08] text-cream sm:text-6xl">
          {title} {highlight && <span className="gold-text">{highlight}</span>}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/70">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
