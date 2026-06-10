"use client";
import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  once = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Set to true to animate in once and stay visible (e.g. hero elements) */
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setShown(true);
      if (once) return;
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (once) {
          if (e.isIntersecting) { setShown(true); obs.disconnect(); }
        } else {
          setShown(e.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "in" : ""} ${className}`}
      // Stagger delay only applies on enter — exit is instant for clean feel
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
