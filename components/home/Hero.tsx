"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/data";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Full-bleed hero background */}
      <Image
        src="/images/kitchen-african-oasis.jpg"
        alt="Luxury African kitchen interior"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Overlays: 65% navy so bg is visible but text pops */}
      <div className="absolute inset-0 bg-navy-900/45" />
      <div className="absolute inset-0 grid-texture opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(22,48,110,0.5),transparent_60%)]" />
      <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-gold/8 blur-[130px]" />

      <div className="container-luxe relative grid min-h-screen items-center gap-12 pt-28 lg:grid-cols-12 lg:pt-20">
        {/* copy */}
        <div className="lg:col-span-7">
          <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 backdrop-blur-sm">
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
            className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-cream/85"
            style={{ animationDelay: "220ms", opacity: 0 }}
          >
            Quality finishing products. Reliable supply. Lasting value. Kenya&apos;s premium
            partner for paints, putty, tiles, gypsum, granite and sanitaryware.
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

          <div
            className="mt-12 flex max-w-md animate-fade-up items-center gap-4 rounded-xl border border-gold/20 bg-white/[0.06] p-4 backdrop-blur-sm"
            style={{ animationDelay: "460ms", opacity: 0 }}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-cream">Exclusive flexible credit for developers</p>
              <Link href="/solutions#developers" className="text-xs text-gold hover:underline">
                See developer solutions
              </Link>
            </div>
          </div>
        </div>

        {/* Floating image cards — padding-bottom trick keeps full image visible */}
        <div
          className="hidden animate-fade-up lg:col-span-5 lg:flex lg:flex-col lg:gap-3"
          style={{ animationDelay: "280ms", opacity: 0 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-luxe">
            <div className="relative w-full" style={{ paddingBottom: "62.5%" }}>
              <Image
                src="/images/bathroom-gold-marble.jpg"
                alt="Luxury gold marble bathroom"
                fill
                className="object-cover object-center"
                sizes="500px"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/75 via-transparent to-transparent" />
            <p className="absolute bottom-3 left-4 text-sm font-semibold text-cream drop-shadow-md">Premium Bathroom Finishes</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-luxe">
              <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                <Image
                  src="/images/bedroom-luxury-marble.jpg"
                  alt="Luxury bedroom"
                  fill
                  className="object-cover object-center"
                  sizes="240px"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/75 via-transparent to-transparent" />
              <p className="absolute bottom-2 left-3 text-xs font-semibold text-cream drop-shadow-md">Luxury Interiors</p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-gold/20 shadow-luxe">
              <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                <Image
                  src="/images/villa-pool-tropical.jpg"
                  alt="Tropical villa"
                  fill
                  className="object-cover object-center"
                  sizes="240px"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/75 via-transparent to-transparent" />
              <p className="absolute bottom-2 left-3 text-xs font-semibold text-cream drop-shadow-md">Developer Scale</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-gold/15 bg-navy-900/60 py-4 backdrop-blur-sm">
        <div className="container-luxe text-center text-sm font-medium uppercase tracking-[0.2em] text-gold/80">
          {COMPANY.keywords}
        </div>
      </div>
    </section>
  );
}
