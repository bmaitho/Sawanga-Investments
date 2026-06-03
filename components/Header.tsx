"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { COMPANY } from "@/lib/data";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Painter Portal", href: "/painter-portal" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold/15 bg-navy-900/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="container-luxe flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-11 w-11" />
          <div className="leading-none">
            <div className="font-display text-xl font-semibold tracking-wide text-cream">
              SAWANGA
            </div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-gold/80">
              Investment Limited
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group relative font-sans text-sm font-medium text-cream/80 transition-colors hover:text-gold"
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <a href={`tel:${COMPANY.phones[0].replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold">
            <Phone className="h-4 w-4" /> {COMPANY.phones[0]}
          </a>
          <Link href="/quote" className="btn-gold">
            Request a Quote
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="text-cream lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {/* mobile drawer */}
      {open && (
        <div className="border-t border-gold/15 bg-navy-900/98 backdrop-blur-xl lg:hidden">
          <div className="container-luxe flex flex-col gap-1 py-6">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-sans text-base text-cream/85 transition-colors hover:bg-gold/10 hover:text-gold"
              >
                {n.label}
              </Link>
            ))}
            <Link href="/quote" onClick={() => setOpen(false)} className="btn-gold mt-3">
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
