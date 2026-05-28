import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { PRODUCTS } from "@/lib/data";

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
                className="card-luxe group flex h-full flex-col p-8 hover:-translate-y-1 hover:border-gold/40 hover:shadow-luxe"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/12 text-gold transition-colors group-hover:bg-gold group-hover:text-navy-900">
                  <Icon name={p.icon} className="h-7 w-7" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-cream">
                  {p.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-cream/60">
                  {p.blurb}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Explore range <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
