import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

const GALLERY = [
  {
    img: "/images/living-room-afro-chic.jpg",
    headline: "Afro Modern Living",
    sub: "Paints · Putty · Gypsum",
    span: "lg:col-span-2",
    height: "h-80",
    pos: "object-center",
  },
  {
    img: "/images/corridor-luxury-water.jpg",
    headline: "The Grand Approach",
    sub: "Stone · Floor tiles · Feature walls",
    span: "lg:col-span-1",
    height: "h-80",
    pos: "object-center",
  },
  {
    img: "/images/bathroom-stone-wood-tub.jpg",
    headline: "A Private Sanctuary",
    sub: "Tiles · Sanitaryware · Granite",
    span: "lg:col-span-1",
    height: "h-80",
    pos: "object-center",
  },
  {
    img: "/images/apartments-golden-hour.jpg",
    headline: "Developer Scale Excellence",
    sub: "Full exterior & interior package",
    span: "lg:col-span-1",
    height: "h-80",
    pos: "object-top",
  },
  {
    img: "/images/entryway-stone-arch.jpg",
    headline: "A Welcome That Defines You",
    sub: "Stone · Putty · Flooring",
    span: "lg:col-span-2",
    height: "h-80",
    pos: "object-center",
  },
];

export default function ProjectGallery() {
  return (
    <section className="relative py-24">
      <div className="container-luxe">
        <Reveal>
          <div className="flex flex-col items-end justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="eyebrow">From Vision to Reality</span>
              <h2 className="mt-4 font-display text-4xl font-semibold text-cream sm:text-5xl">
                The standard you&apos;re{" "}
                <span className="gold-text">building toward.</span>
              </h2>
              <p className="mt-3 max-w-xl text-cream/65">
                This is what becomes possible when the right finishing products meet the right
                craftsmanship. Premium interiors and spaces across Kenya — built with the
                materials SAWANGA supplies.
              </p>
            </div>
            <Link href="/quote" className="btn-gold shrink-0 group">
              Build yours
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {GALLERY.map((g, i) => (
            <Reveal key={g.headline} delay={i * 70} className={g.span}>
              <div
                className={`group relative overflow-hidden rounded-2xl ${g.height} cursor-pointer`}
              >
                <Image
                  src={g.img}
                  alt={g.headline}
                  fill
                  className={`object-cover ${g.pos} transition-transform duration-700 group-hover:scale-105`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent transition-opacity duration-300 group-hover:from-navy-900/80" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                    <p className="font-display text-lg font-semibold text-cream">{g.headline}</p>
                    <p className="mt-1 text-xs tracking-wide text-gold/80">{g.sub}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
