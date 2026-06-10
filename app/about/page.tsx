import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { WHY_PARTNER } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description: "SAWANGA Investment Limited — premium building finishes partner in Kenya.",
};

const VALUES = [
  { title: "Quality First", desc: "We stock only tested products from trusted brands.", icon: "BadgeCheck" },
  { title: "Reliable Supply", desc: "On-time delivery and consistent stock keep your project moving.", icon: "Truck" },
  { title: "Genuine Partnership", desc: "Flexible credit, fair pricing and technical advice.", icon: "Handshake" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About SAWANGA"
        title="Finishes that"
        highlight="build trust."
        subtitle="We supply the premium finishing products that turn structures into spaces."
        bgImage="/images/kitchen-dark-luxury.jpg"
      />

      <section className="py-16">
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">
                Build Better. <span className="gold-text">Finish Stronger.</span>
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-cream/70">
                <p>SAWANGA Investment Limited is a Kenyan building finishes company based at Kitengela Plaza, serving clients across Nairobi and beyond.</p>
                <p>From paints and putty to tiles, gypsum, granite and sanitaryware, we bring together a complete finishing range under one trusted partner.</p>
                <p>Quality finishing products, reliable supply, and lasting value. Finishes that build trust.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="btn-gold group">
                  Explore products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/contact" className="btn-outline">Contact us</Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-gold/20">
              <div className="relative w-full" style={{ paddingBottom: "70%" }}>
                <Image src="/images/entryway-stone-arch.jpg" alt="Luxury entryway" fill className="object-cover object-center" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
              <div className="absolute bottom-5 left-5 grid grid-cols-2 gap-3">
                {[["6+","Core product lines"],["100%","Tested quality"]].map(([stat,label]) => (
                  <div key={label} className="rounded-xl border border-gold/25 bg-navy-900/80 px-4 py-3 text-center backdrop-blur-sm">
                    <div className="font-display text-2xl font-semibold gold-text">{stat}</div>
                    <div className="mt-1 text-xs text-cream/60">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="container-luxe">
          <Reveal>
            <div className="text-center">
              <span className="eyebrow">Our Values</span>
              <h2 className="mt-4 font-display text-4xl font-semibold text-cream">What we <span className="gold-text">stand for</span></h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {VALUES.map((v,i) => (
              <Reveal key={v.title} delay={i*90}>
                <div className="card-luxe flex h-full flex-col p-8 hover:border-gold/30">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/12 text-gold">
                    <Icon name={v.icon} className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-cream">{v.title}</h3>
                  <p className="mt-3 leading-relaxed text-cream/65">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-gold/15 py-16">
        <Image src="/images/granite-stone-cladding.jpg" alt="" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-navy-900/90" />
        <div className="container-luxe relative grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {WHY_PARTNER.map((w,i) => (
            <Reveal key={w.title} delay={i*60}>
              <div className="flex flex-col items-center p-4 text-center">
                <Icon name={w.icon} className="h-8 w-8 text-gold" />
                <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-gold">{w.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-cream/70">{w.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
