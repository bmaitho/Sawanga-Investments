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
