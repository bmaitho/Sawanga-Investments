import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = { title: "Request a Quote", description: "Request a tailored quotation from SAWANGA Investment Limited." };

export default function QuotePage() {
  return (
    <>
      <PageHero eyebrow="Request a Quote" title="Let us price your" highlight="project." subtitle="Tell us what you need and our team will prepare a tailored quotation." bgImage="/images/shower-dark-luxury.jpg" />
      <section className="pb-24">
        <div className="container-luxe max-w-4xl">
          <Suspense fallback={<div className="card-luxe p-10 text-cream/60">Loading form...</div>}>
            <QuoteForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
