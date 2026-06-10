import type { Metadata } from "next";
import { MapPin, Mail, Phone, MessageCircle, Clock } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { COMPANY } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SAWANGA Investment Limited â€” call, email, WhatsApp or visit us at Kitengela Plaza. We're here to help you finish right.",
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
        subtitle="Reach out for quotations, product enquiries, developer credit, or anything else â€” our team is ready to help."
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
                  <p className="text-sm text-cream/65">Mon â€“ Fri: 8:00 â€“ 5:30</p>
                  <p className="text-sm text-cream/65">Sat: 8:00 â€“ 1:00</p>
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
