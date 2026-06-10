# ================================================================
# SAWANGA Investment Limited
# Image Integration — Full Site Update
# ================================================================
# Run this from INSIDE your project root:
#   cd "C:\Users\Administrator\OneDrive\Desktop\Sawanga-Investments"
#   .\update-images.ps1
# ================================================================

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path "$root\app")) {
    Write-Host "ERROR: Run this script from inside the Sawanga-Investments project root." -ForegroundColor Red
    Write-Host "  cd to the folder that contains app\, components\, package.json" -ForegroundColor Yellow
    exit 1
}

function Write-File {
    param([string]$RelPath, [string]$Content)
    $full = Join-Path $root $RelPath
    $dir  = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    [System.IO.File]::WriteAllText($full, $Content, [System.Text.Encoding]::UTF8)
    Write-Host "  UPDATED  $RelPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "Writing 11 updated files..." -ForegroundColor Cyan
Write-Host ""

Write-File 'components\PageHero.tsx' @'
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

'@

Write-File 'components\home\Hero.tsx' @'
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
                See developer solutions →
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

'@

Write-File 'components\home\CoreProducts.tsx' @'
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { PRODUCTS } from "@/lib/data";
import { PRODUCT_CARD_IMAGES } from "@/lib/product-images";

export default function CoreProducts() {
  return (
    <section className="relative py-24">
      <div className="container-luxe">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Our Core Finishing Products</span>
            <h2 className="mt-4 font-display text-4xl font-semibold text-cream sm:text-5xl">
              Everything to <span className="gold-text">finish right</span>
            </h2>
            <p className="mt-4 text-cream/65">
              A complete finishing range, sourced from trusted brands and stocked for reliable,
              on-time supply across Kenya.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link
                href={`/products#${p.slug}`}
                className="card-luxe group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:border-gold/40 hover:shadow-luxe"
              >
                {/* thumbnail */}
                {PRODUCT_CARD_IMAGES[p.slug] && (
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={PRODUCT_CARD_IMAGES[p.slug]}
                      alt={p.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
                    <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 backdrop-blur-sm text-gold transition-colors group-hover:bg-gold group-hover:text-navy-900">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </div>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-7">
                  {!PRODUCT_CARD_IMAGES[p.slug] && (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/12 text-gold transition-colors group-hover:bg-gold group-hover:text-navy-900">
                      <Icon name={p.icon} className="h-7 w-7" />
                    </div>
                  )}
                  <h3 className="mt-4 font-display text-xl font-semibold text-cream">
                    {p.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-cream/60">
                    {p.blurb}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                    Explore range <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

'@

Write-File 'components\home\Sections.tsx' @'
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { SOLUTIONS, PARTNERS } from "@/lib/data";

export function SolutionsTeaser() {
  return (
    <section className="relative py-24">
      {/* subtle background */}
      <Image
        src="/images/living-room-afro-chic.jpg"
        alt=""
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-navy-900/88" />
      <div className="container-luxe relative">
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
      {/* Background image */}
      <Image
        src="/images/bathroom-spa-stone.jpg"
        alt=""
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-navy-900/85" />
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
      {/* Background image */}
      <Image
        src="/images/hallway-dark-moody.jpg"
        alt=""
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-navy-900/80" />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-700/60 via-navy-800/60 to-navy-900/60" />
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

'@

Write-File 'components\home\WhyPartner.tsx' @'
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

'@

Write-File 'app\about\page.tsx' @'
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { WHY_PARTNER } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us — Finishes That Build Trust",
  description:
    "SAWANGA Investment Limited is a premium building finishes and interior solutions partner in Kenya, serving developers, contractors, institutions and homeowners.",
};

const VALUES = [
  {
    title: "Quality First",
    desc: "We stock only tested products from trusted brands — because a finish is only as good as what's behind it.",
    icon: "BadgeCheck",
  },
  {
    title: "Reliable Supply",
    desc: "On-time delivery and consistent stock keep your project moving without costly delays.",
    icon: "Truck",
  },
  {
    title: "Genuine Partnership",
    desc: "Flexible credit, fair pricing and technical advice — we succeed when your project succeeds.",
    icon: "Handshake",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About SAWANGA"
        title="Finishes that"
        highlight="build trust."
        subtitle="We supply the premium finishing products that turn structures into spaces — and we back every order with reliable supply and expert support."
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
                <p>
                  SAWANGA Investment Limited is a Kenyan building finishes and interior solutions
                  company based at Kitengela Plaza, serving clients across Nairobi and beyond.
                </p>
                <p>
                  From paints and putty to tiles, gypsum, granite and sanitaryware, we bring
                  together a complete finishing range under one trusted partner — with the
                  reliability developers, contractors and institutions depend on, and the advice
                  homeowners value.
                </p>
                <p>
                  Our promise is simple: quality finishing products, reliable supply, and lasting
                  value. Finishes that build trust.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/products" className="btn-gold group">
                  Explore products
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/contact" className="btn-outline">
                  Contact us
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-gold/20">
              <Image
                src="/images/entryway-stone-arch.jpg"
                alt="Luxury entryway with stone arch"
                width={600}
                height={500}
                className="h-80 w-full object-cover lg:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6 grid grid-cols-2 gap-3">
                {[
                  ["6+", "Core product lines"],
                  ["100%", "Tested quality"],
                ].map(([stat, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-gold/25 bg-navy-900/80 px-4 py-3 text-center backdrop-blur-sm"
                  >
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
              <h2 className="mt-4 font-display text-4xl font-semibold text-cream">
                What we <span className="gold-text">stand for</span>
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
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

      {/* Values strip with background */}
      <section className="relative border-t border-gold/15 py-16">
        <Image
          src="/images/granite-stone-cladding.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/88" />
        <div className="container-luxe relative">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {WHY_PARTNER.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div className="flex flex-col items-center p-4 text-center">
                  <Icon name={w.icon} className="h-8 w-8 text-gold" />
                  <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-gold">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-cream/55">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

'@

Write-File 'app\contact\page.tsx' @'
import type { Metadata } from "next";
import { MapPin, Mail, Phone, MessageCircle, Clock } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { COMPANY } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SAWANGA Investment Limited — call, email, WhatsApp or visit us at Kitengela Plaza. We're here to help you finish right.",
};

export default function ContactPage() {
  const items = [
    { icon: Phone, title: "Call us", lines: COMPANY.phones, href: `tel:${COMPANY.phones[0].replace(/\s/g, "")}` },
    { icon: Mail, title: "Email us", lines: [COMPANY.email], href: `mailto:${COMPANY.email}` },
    { icon: MessageCircle, title: "WhatsApp", lines: ["Chat with our team"], href: `https://wa.me/${COMPANY.whatsapp}` },
    { icon: MapPin, title: "Visit us", lines: [COMPANY.location, COMPANY.address] },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build something"
        highlight="great together."
        subtitle="Reach out for quotations, product enquiries, developer credit, or anything else — our team is ready to help."
        bgImage="/images/door-arched-luxury.jpg"
      />

      <section className="pb-24">
        <div className="container-luxe grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((it) => {
                const Inner = (
                  <div className="card-luxe flex items-start gap-4 p-6 transition hover:border-gold/30">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold">
                      <it.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-cream">{it.title}</h3>
                      {it.lines.map((l) => (
                        <p key={l} className="text-sm text-cream/65">{l}</p>
                      ))}
                    </div>
                  </div>
                );
                return it.href ? (
                  <a key={it.title} href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block">
                    {Inner}
                  </a>
                ) : (
                  <div key={it.title}>{Inner}</div>
                );
              })}
              <div className="card-luxe flex items-start gap-4 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-cream">Business hours</h3>
                  <p className="text-sm text-cream/65">Mon – Fri: 8:00 – 5:30</p>
                  <p className="text-sm text-cream/65">Sat: 8:00 – 1:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

'@

Write-File 'app\quote\page.tsx' @'
import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a tailored quotation from SAWANGA Investment Limited for paints, tiles, gypsum, granite, sanitaryware and more.",
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="Let's price your"
        highlight="project."
        subtitle="Tell us what you need and our team will prepare a tailored quotation with the right products, pricing and supply schedule."
        bgImage="/images/shower-dark-luxury.jpg"
      />
      <section className="pb-24">
        <div className="container-luxe max-w-4xl">
          <Suspense fallback={<div className="card-luxe p-10 text-cream/60">Loading form…</div>}>
            <QuoteForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}

'@

Write-File 'app\products\page.tsx' @'
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { PRODUCTS } from "@/lib/data";
import { PRODUCT_IMAGES } from "@/lib/product-images";

export const metadata: Metadata = {
  title: "Products — Paints, Tiles, Gypsum, Granite & Sanitaryware",
  description:
    "Explore SAWANGA's complete finishing range: premium paints & coatings, wall master & putty, tile adhesives, gypsum & decorative finishes, granite & stone, and sanitaryware & fittings.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Core Finishing Products"
        title="A complete range to"
        highlight="finish right."
        subtitle="Sourced from trusted brands and stocked for reliable, on-time supply across Kenya — from a single room to an entire development."
        bgImage="/images/granite-stone-staircase.jpg"
      />

      <section className="pb-24">
        <div className="container-luxe space-y-8">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 80}>
              <div id={p.slug} className="card-luxe scroll-mt-28 overflow-hidden md:flex">
                {/* image panel */}
                <div className="relative overflow-hidden md:w-2/5">
                  {PRODUCT_IMAGES[p.slug] ? (
                    <>
                      <Image
                        src={PRODUCT_IMAGES[p.slug]}
                        alt={p.name}
                        width={700}
                        height={500}
                        className="h-56 w-full object-cover md:h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent md:bg-gradient-to-r" />
                      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/20 backdrop-blur-sm text-gold">
                          <Icon name={p.icon} className="h-7 w-7" />
                        </div>
                        <h2 className="mt-3 font-display text-2xl font-semibold text-cream">
                          {p.name}
                        </h2>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full min-h-[14rem] items-center justify-center bg-gradient-to-br from-navy-700 to-navy-900 p-10">
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                          <Icon name={p.icon} className="h-12 w-12" />
                        </div>
                        <h2 className="text-center font-display text-2xl font-semibold text-cream">{p.name}</h2>
                      </div>
                    </div>
                  )}
                </div>

                {/* content panel */}
                <div className="p-8 md:w-3/5 md:p-10">
                  <p className="text-lg leading-relaxed text-cream/75">{p.detail}</p>
                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm text-cream/80">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/quote?product=${encodeURIComponent(p.name)}`}
                    className="btn-gold group mt-8"
                  >
                    Request a Quote
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative border-t border-gold/15 py-20">
        <Image
          src="/images/corridor-luxury-water.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-navy-900/85" />
        <div className="container-luxe relative text-center">
          <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">
            Need a product not listed here?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/65">
            We also supply cabinets, doors, and more. Tell us what your project needs and we&apos;ll
            source it for you.
          </p>
          <Link href="/contact" className="btn-outline mt-8">
            Talk to our team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

'@

Write-File 'app\solutions\page.tsx' @'
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { SOLUTIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Solutions — Developers, Contractors, Institutions & Homeowners",
  description:
    "Project-focused finishing solutions tailored for developers (with flexible credit), contractors, institutions and homeowners across Kenya.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Built around"
        highlight="your project."
        subtitle="Whoever you are and whatever you're building, SAWANGA matches the right products, pricing and supply to your needs."
        bgImage="/images/apartments-golden-hour.jpg"
      />

      <section className="pb-24">
        <div className="container-luxe grid gap-8 lg:grid-cols-2">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 90}>
              <div
                id={s.slug}
                className="card-luxe flex h-full scroll-mt-28 flex-col overflow-hidden hover:border-gold/30"
              >
                {/* Image banner per solution */}
                {[
                  { slug: "developers", img: "/images/apartments-golden-hour.jpg" },
                  { slug: "contractors", img: "/images/kitchen-dark-luxury.jpg" },
                  { slug: "institutions", img: "/images/corridor-luxury-water.jpg" },
                  { slug: "homeowners", img: "/images/kitchen-warm-modern.jpg" },
                ].find(x => x.slug === s.slug) && (
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={[
                        { slug: "developers", img: "/images/apartments-golden-hour.jpg" },
                        { slug: "contractors", img: "/images/kitchen-dark-luxury.jpg" },
                        { slug: "institutions", img: "/images/corridor-luxury-water.jpg" },
                        { slug: "homeowners", img: "/images/kitchen-warm-modern.jpg" },
                      ].find(x => x.slug === s.slug)!.img}
                      alt={s.title}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/20 backdrop-blur-sm text-gold">
                        <Icon name={s.icon} className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-semibold text-cream">{s.title}</h2>
                        <p className="text-xs uppercase tracking-wide text-gold/70">{s.audience}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <p className="leading-relaxed text-cream/70">{s.description}</p>
                  <div className="mt-6 space-y-3">
                    {s.points.map((pt) => (
                      <div key={pt} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm text-cream/80">{pt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-8">
                    <Link
                      href={`/quote?type=${s.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-gold hover:underline"
                    >
                      Get started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Developer credit highlight */}
      <section className="relative border-t border-gold/15 py-20">
        <Image
          src="/images/bathroom-stone-basin.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-700/90 to-navy-900/90" />
        <div className="container-luxe relative">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">For Developers</span>
              <h2 className="mt-4 font-display text-4xl font-semibold text-cream">
                Exclusive <span className="gold-text">flexible credit</span> terms
              </h2>
              <p className="mt-5 text-cream/70">
                We understand developer cash flow. Qualifying developers access flexible credit,
                volume pricing and scheduled deliveries — so your finishing supply never holds up
                your build. Speak to us about setting up a credit account.
              </p>
              <Link href="/contact" className="btn-gold mt-8">
                Apply for developer credit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

'@

Write-File 'app\painter-portal\page.tsx' @'
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UserPlus, Share2, CheckCircle2, Wallet } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import PainterSignup from "@/components/PainterSignup";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Painter Referral Portal — Refer & Earn",
  description:
    "Join the SAWANGA painter network. Refer clients, track approvals, and earn a percentage of every referred sale — redeemable via M-Pesa, bank or store credit.",
};

const STEPS = [
  { icon: UserPlus, title: "Register", desc: "Create your free painter account in minutes." },
  { icon: Share2, title: "Refer clients", desc: "Submit clients you bring to SAWANGA with their project details." },
  { icon: CheckCircle2, title: "Get approved", desc: "We confirm the sale and approve your referral." },
  { icon: Wallet, title: "Earn & redeem", desc: "Earn a % of the sale value and cash out via M-Pesa, bank or credit." },
];

export default function PainterPortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Painter Referral Portal"
        title="Refer clients."
        highlight="Earn real rewards."
        subtitle="The SAWANGA painter network rewards you for the business you bring. Earn a percentage of every referred sale — tracked transparently, paid reliably."
        bgImage="/images/paint-application.jpg"
      />

      <section className="pb-16">
        <div className="container-luxe grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* How it works */}
          <div>
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-cream">
                How it <span className="gold-text">works</span>
              </h2>
            </Reveal>
            <div className="mt-8 space-y-5">
              {STEPS.map((s, i) => (
                <Reveal key={s.title} delay={i * 80}>
                  <div className="card-luxe flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-semibold text-cream">
                          {i + 1}. {s.title}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-cream/65">{s.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={120}>
              <div className="card-luxe mt-6 border-gold/25 p-6">
                <p className="text-sm text-cream/70">
                  <span className="font-semibold text-gold">Reward rate:</span> Earn a percentage
                  of each confirmed referred sale. Points are credited automatically the moment
                  SAWANGA approves your referral, and are redeemable for cash via M-Pesa, bank
                  transfer, or store credit.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Signup */}
          <div id="register">
            <Reveal delay={100}>
              <PainterSignup />
            </Reveal>
            <p className="mt-6 text-center text-sm text-cream/60">
              Already registered?{" "}
              <Link href="/painter-portal/login" className="font-semibold text-gold hover:underline">
                Log in to your dashboard
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

'@


Write-Host ""
Write-Host "All 11 files updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. npm run dev     <- verify locally" -ForegroundColor White
Write-Host "  2. npm run build   <- confirm no errors" -ForegroundColor White
Write-Host "  3. git add ." -ForegroundColor White
Write-Host "  4. git commit -m `"feat: add background images to all pages and sections`"" -ForegroundColor White
Write-Host "  5. git push        <- Vercel auto-deploys" -ForegroundColor White
Write-Host ""