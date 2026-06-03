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
