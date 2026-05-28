import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { SOLUTIONS, PARTNERS } from "@/lib/data";

export function SolutionsTeaser() {
  return (
    <section className="relative py-24">
      <div className="container-luxe">
        <Reveal>
          <div className="flex flex-col items-end justify-between gap-6 md:flex-row md:items-center">
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

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <Link
                href={`/solutions#${s.slug}`}
                className="card-luxe group flex h-full flex-col p-7 hover:-translate-y-1 hover:border-gold/40"
              >
                <Icon name={s.icon} className="h-9 w-9 text-gold" />
                <h3 className="mt-5 font-display text-lg font-semibold text-cream">
                  {s.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-gold/70">
                  {s.audience}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-cream/60">
                  {s.description}
                </p>
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
    <section className="relative border-y border-gold/15 bg-navy-900/50 py-20">
      <div className="container-luxe">
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
            <Reveal key={p.name} delay={i * 70}>
              <div className="card-luxe flex h-full flex-col items-center justify-center p-8 text-center hover:border-gold/30">
                <div className="font-display text-xl font-semibold text-cream">{p.name}</div>
                <p className="mt-2 text-xs text-cream/55">{p.note}</p>
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
    <section className="relative overflow-hidden py-24">
      <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-gold/10 blur-[100px]" />
      <div className="container-luxe relative">
        <Reveal>
          <div className="card-luxe relative overflow-hidden rounded-3xl border-gold/25 p-10 md:p-14">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="eyebrow">Painter Referral Portal</span>
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-cream">
                  Refer clients.
                  <br />
                  <span className="gold-text">Earn real rewards.</span>
                </h2>
                <p className="mt-5 max-w-md text-cream/65">
                  Join the SAWANGA painter network. Register, refer your clients, track every
                  approval, and earn a percentage of each referred sale — redeemable for cash
                  via M-Pesa, bank, or store credit.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/painter-portal" className="btn-gold group">
                    Join the Portal
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="/painter-portal/login" className="btn-outline">
                    Painter Login
                  </Link>
                </div>
              </div>

              {/* reward illustration */}
              <div className="relative">
                <div className="rounded-2xl border border-gold/25 bg-navy-900/70 p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-cream/60">Your reward balance</span>
                    <Star className="h-5 w-5 text-gold" fill="#c8a24b" />
                  </div>
                  <div className="mt-3 font-display text-4xl font-semibold gold-text">
                    KES 24,500
                  </div>
                  <div className="mt-6 space-y-3">
                    {[
                      ["Riverside Apartments", "approved", "KES 9,000"],
                      ["Greenview Villas", "approved", "KES 12,000"],
                      ["Mwangi Residence", "pending", "—"],
                    ].map(([name, status, amt]) => (
                      <div
                        key={name}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3"
                      >
                        <div>
                          <div className="text-sm text-cream/85">{name}</div>
                          <div
                            className={`text-xs ${
                              status === "approved" ? "text-emerald-400" : "text-gold/70"
                            }`}
                          >
                            {status}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-cream">{amt}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900" />
      <div className="absolute inset-0 grid-texture opacity-40" />
      <div className="container-luxe relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            Let&apos;s build something <span className="gold-text">great together.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream/70">
            Tell us about your project and our team will put together a tailored quotation —
            with the right products, pricing and supply schedule.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/quote" className="btn-gold group">
              Request a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
