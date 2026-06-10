import Image from "next/image";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { WHY_PARTNER } from "@/lib/data";

export default function WhyPartner() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background image */}
      <Image
        src="/images/gypsum-led-ceiling.jpg"
        alt=""
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-navy-900/88" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,48,110,0.35),transparent_70%)]" />
      <div className="container-luxe relative">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Why Partner With SAWANGA?</span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-cream sm:text-5xl">
              Built for the way <span className="gold-text">you build</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_PARTNER.map((w, i) => (
            <Reveal key={w.title} delay={i * 70}>
              <div className="card-luxe flex h-full flex-col items-center p-7 text-center hover:border-gold/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                  <Icon name={w.icon} className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-base font-semibold uppercase tracking-wide text-gold">
                  {w.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/60">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
