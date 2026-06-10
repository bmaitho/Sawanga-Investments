import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { SOLUTIONS, PARTNERS } from "@/lib/data";

const bg = (url: string): React.CSSProperties => ({
  backgroundImage: `url('${url}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
});

export function SolutionsTeaser() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0" style={bg("/images/living-room-afro-chic.jpg")} />
      <div className="absolute inset-0 bg-[#0A1A3F]/55" />
      <div className="container-luxe relative">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <span className="eyebrow">Solutions</span>
              <h2 className="mt-4 font-display text-4xl font-semibold text-cream sm:text-5xl">
                Tailored to your <span className="gold-text">project</span>
              </h2>
            </div>
            <Link href="/solutions" className="btn-outline shrink-0">
              All solutions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.slug} delay={i * 120}>
              <Link href={`/solutions#${s.slug}`} className="card-luxe group flex h-full flex-col bg-navy-900/75 p-7 hover:-translate-y-1 hover:border-gold/40">
                <Icon name={s.icon} className="h-9 w-9 text-gold" />
                <h3 className="mt-5 font-display text-lg font-semibold text-cream">{s.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-gold-light">{s.audience}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/90">{s.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PartnerBrands() {
  return (
    <section className="relative border-y border-gold/15 py-20">
      <div className="absolute inset-0" style={bg("/images/living-room-afro-chic.jpg")} />
      <div className="absolute inset-0 bg-[#0A1A3F]/55" />
      <div className="container-luxe relative">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">Partner Brands</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-cream sm:text-4xl">
              Stocked with brands <span className="gold-text">you trust</span>
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNERS.map((p, i) => (
            <Reveal key={p.name} delay={i * 110}>
              <div className="card-luxe group flex h-full flex-col overflow-hidden bg-navy-900/70 hover:border-gold/40">
                <div className="relative h-52 w-full bg-white/5">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-4xl font-bold text-gold/20">{p.name[0]}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center px-6 py-5 text-center">
                  <div className="font-display text-lg font-semibold text-cream">{p.name}</div>
                  <p className="mt-1 text-xs text-gold-light">{p.note}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PainterTeaser() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0" style={bg("/images/corridor-luxury-water.jpg")} />
      <div className="absolute inset-0 bg-[#0A1A3F]/78" />
      <div className="container-luxe relative">
        <div className="card-luxe relative rounded-3xl border-gold/25 bg-navy-900/80 p-8 md:p-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal delay={0}>
              <div className="flex flex-col gap-6">
                <span className="eyebrow">Painter Referral Portal</span>
                <h2 className="font-display text-3xl font-semibold leading-tight text-cream sm:text-4xl">
                  Refer clients.<br /><span className="gold-text">Earn real rewards.</span>
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-cream/90 sm:text-base">
                  Join the SAWANGA painter network. Register, refer your clients, track every
                  approval, and earn a percentage of each referred sale.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href="/painter-portal" className="btn-gold group">
                    Join the Portal
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/painter-portal/login" className="btn-outline">Painter Login</Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="rounded-2xl border border-gold/25 bg-navy-900/75 p-6 md:p-8 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cream/60">Your reward balance</span>
                  <Star className="h-5 w-5 text-gold" fill="#c8a24b" />
                </div>
                <div className="mt-3 font-display text-4xl font-semibold gold-text">KES 24,500</div>
                <div className="mt-6 space-y-3">
                  {[
                    ["Riverside Apartments", "approved", "KES 9,000"],
                    ["Greenview Villas",     "approved", "KES 12,000"],
                    ["Mwangi Residence",     "pending",  "—"],
                  ].map(([name, status, amt]) => (
                    <div key={name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-cream/90">{name}</div>
                        <div className={`text-xs ${status === "approved" ? "text-emerald-400" : "text-gold/70"}`}>{status}</div>
                      </div>
                      <div className="text-sm font-semibold text-cream">{amt}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0" style={bg("/images/corridor-luxury-water.jpg")} />
      <div className="absolute inset-0 bg-[#0A1A3F]/78" />
      <div className="container-luxe relative text-center">
        <Reveal delay={0}>
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold leading-tight text-cream sm:text-5xl">
            Let&apos;s build something <span className="gold-text">great together.</span>
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-cream/80 sm:text-base">
            Tell us about your project and our team will put together a tailored quotation —
            with the right products, pricing and supply schedule.
          </p>
        </Reveal>
        <Reveal delay={280}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/quote" className="btn-gold group">
              Request a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
