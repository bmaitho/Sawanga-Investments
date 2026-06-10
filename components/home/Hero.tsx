"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero background image */}
      <Image
        src="/images/kitchen-african-oasis.jpg"
        alt="Luxury African kitchen interior"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 bg-navy-900/70" />
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
            className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-cream/80"
            style={{ animationDelay: "220ms", opacity: 0 }}
          >
            Quality finishing products. Reliable supply. Lasting value. Kenya&apos;s premium
            partner for paints, putty, tiles, gypsum, granite and sanitaryware â€” serving
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
            className="mt-12 flex max-w-md animate-fade-up items-center gap-4 rounded-xl border border-gold/20 bg-white/[0.05] p-4 backdrop-blur-sm"
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
                See developer solutions â†’
              </Link>
            </div>
          </div>
        </div>

        {/* floating image cards */}
        <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:gap-4">
          <div
            className="relative animate-fade-up overflow-hidden rounded-2xl border border-gold/20 shadow-luxe"
            style={{ animationDelay: "300ms", opacity: 0 }}
          >
            <Image
              src="/images/bathroom-gold-marble.jpg"
              alt="Luxury gold marble bathroom"
              width={480}
              height={220}
              className="h-44 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
            <p className="absolute bottom-3 left-4 text-sm font-semibold text-cream">Premium Bathroom Finishes</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="relative animate-fade-up overflow-hidden rounded-2xl border border-gold/20 shadow-luxe"
              style={{ animationDelay: "380ms", opacity: 0 }}
            >
              <Image
                src="/images/bedroom-luxury-marble.jpg"
                alt="Luxury bedroom"
                width={220}
                height={160}
                className="h-36 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
              <p className="absolute bottom-2 left-3 text-xs font-semibold text-cream">Luxury Interiors</p>
            </div>
            <div
              className="relative animate-fade-up overflow-hidden rounded-2xl border border-gold/20 shadow-luxe"
              style={{ animationDelay: "440ms", opacity: 0 }}
            >
              <Image
                src="/images/villa-pool-tropical.jpg"
                alt="Tropical villa"
                width={220}
                height={160}
                className="h-36 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
              <p className="absolute bottom-2 left-3 text-xs font-semibold text-cream">Developer Scale</p>
            </div>
          </div>
        </div>
      </div>

      {/* keyword strip */}
      <div className="relative border-t border-gold/15 bg-navy-900/60 py-4 backdrop-blur-sm">
        <div className="container-luxe text-center text-sm font-medium uppercase tracking-[0.2em] text-gold/80">
          {COMPANY.keywords}
        </div>
      </div>
    </section>
  );
}
