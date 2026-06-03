"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* layered atmospheric background */}
      <div className="absolute inset-0 grid-texture opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(22,48,110,0.6),transparent_55%)]" />
      <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-navy-600/40 blur-[100px]" />

      <div className="container-luxe relative grid min-h-screen items-center gap-12 pt-28 lg:grid-cols-12 lg:pt-20">
        {/* copy */}
        <div className="lg:col-span-7">
          <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5">
            <ShieldCheck className="h-4 w-4 text-gold" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
              {COMPANY.tagline}
            </span>
          </div>

          <h1
            className="mt-6 animate-fade-up font-display text-5xl font-semibold leading-[1.05] text-cream sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "100ms", opacity: 0 }}
          >
            Build Better.
            <br />
            <span className="gold-text">Finish Stronger.</span>
          </h1>

          <p
            className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-cream/70"
            style={{ animationDelay: "220ms", opacity: 0 }}
          >
            Quality finishing products. Reliable supply. Lasting value. Kenya&apos;s premium
            partner for paints, putty, tiles, gypsum, granite and sanitaryware — serving
            developers, contractors, institutions and homeowners.
          </p>

          <div
            className="mt-10 flex animate-fade-up flex-wrap items-center gap-4"
            style={{ animationDelay: "340ms", opacity: 0 }}
          >
            <Link href="/products" className="btn-gold group">
              Browse Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/quote" className="btn-outline">
              Request a Quote
            </Link>
          </div>

          {/* developer credit ribbon */}
          <div
            className="mt-12 flex max-w-md animate-fade-up items-center gap-4 rounded-xl border border-gold/20 bg-white/[0.03] p-4"
            style={{ animationDelay: "460ms", opacity: 0 }}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-cream">
                Exclusive flexible credit for developers
              </p>
              <Link href="/solutions#developers" className="text-xs text-gold hover:underline">
                See developer solutions →
              </Link>
            </div>
          </div>
        </div>

        {/* product showcase visual */}
        <div className="hidden lg:col-span-5 lg:block">
          <div
            className="relative animate-fade-up"
            style={{ animationDelay: "300ms", opacity: 0 }}
          >
            <div className="absolute -inset-4 rounded-[2rem] border border-gold/15" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-navy-700 to-navy-900 p-8 shadow-luxe">
              <div className="grid grid-cols-3 gap-4">
                {["Premium Emulsion", "Wall Master", "Premium Silk"].map((p, i) => (
                  <div
                    key={p}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-gold/20 bg-navy-900/60 p-4"
                  >
                    {/* paint tin illustration */}
                    <svg viewBox="0 0 60 80" className="h-20 w-14">
                      <rect x="8" y="20" width="44" height="52" rx="3" fill="#0a1a3f" stroke="#c8a24b" strokeWidth="1.5" />
                      <rect x="6" y="16" width="48" height="8" rx="2" fill="#16306e" stroke="#c8a24b" strokeWidth="1.5" />
                      <rect x="22" y="8" width="16" height="10" rx="2" fill="none" stroke="#c8a24b" strokeWidth="1.5" />
                      <rect x="14" y="38" width="32" height="20" rx="2" fill="#c8a24b" opacity="0.18" />
                      <text x="30" y="50" textAnchor="middle" fill="#e4c677" fontSize="6" fontFamily="sans-serif">SAWANGA</text>
                    </svg>
                    <span className="text-center text-[11px] font-medium text-cream/80">{p}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 gold-divider" />
              <p className="mt-5 text-center text-sm text-cream/60">
                Trusted brands. Tested quality.
                <br />
                <span className="text-gold">Proven results.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* keyword strip */}
      <div className="relative border-t border-gold/15 bg-navy-900/50 py-4 backdrop-blur-sm">
        <div className="container-luxe text-center text-sm font-medium uppercase tracking-[0.2em] text-gold/80">
          {COMPANY.keywords}
        </div>
      </div>
    </section>
  );
}
