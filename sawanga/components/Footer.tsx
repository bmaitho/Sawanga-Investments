import Link from "next/link";
import { MapPin, Mail, Phone, Globe } from "lucide-react";
import { Logo } from "./Logo";
import { COMPANY } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/15 bg-navy-900">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <div className="leading-none">
              <div className="font-display text-lg font-semibold text-cream">SAWANGA</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gold/80">
                Investment Limited
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">
            Premium building finishes and interior solutions. Reliable supply, lasting value —
            finishes that build trust.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-5">Explore</h4>
          <ul className="space-y-3 text-sm text-cream/70">
            {[
              ["Products", "/products"],
              ["Solutions", "/solutions"],
              ["Painter Portal", "/painter-portal"],
              ["About Us", "/about"],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="transition-colors hover:text-gold">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-5">Get Started</h4>
          <ul className="space-y-3 text-sm text-cream/70">
            {[
              ["Request a Quote", "/quote"],
              ["Contact Us", "/contact"],
              ["Painter Sign-up", "/painter-portal"],
              ["Developer Credit", "/solutions#developers"],
            ].map(([l, h]) => (
              <li key={h}>
                <Link href={h} className="transition-colors hover:text-gold">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-5">Reach Us</h4>
          <ul className="space-y-4 text-sm text-cream/70">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-gold" />
              <span>
                {COMPANY.address}
                <br />
                {COMPANY.location}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-gold" />
              <span>{COMPANY.phones.join(" / ")}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-gold" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-gold">
                {COMPANY.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Globe className="h-5 w-5 shrink-0 text-gold" />
              <span>{COMPANY.domain}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-luxe flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-cream/50 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <p className="tracking-wide text-gold/70">{COMPANY.keywords}</p>
        </div>
      </div>
    </footer>
  );
}
