"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/data";

const CUSTOMER_TYPES = [
  { v: "developer", l: "Developer" },
  { v: "contractor", l: "Contractor" },
  { v: "institution", l: "Institution" },
  { v: "homeowner", l: "Homeowner" },
];

const BUDGETS = ["Under KES 100k", "KES 100k – 500k", "KES 500k – 2M", "Over KES 2M", "Not sure yet"];

export default function QuoteForm() {
  const params = useSearchParams();
  const preProduct = params.get("product");
  const preType = params.get("type");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    customer_type: preType && CUSTOMER_TYPES.some((c) => c.v === preType) ? preType : "homeowner",
    company: "",
    project_type: "",
    location: "",
    products: preProduct ? [preProduct] : ([] as string[]),
    budget_range: "",
    message: "",
    referral_code: params.get("ref") || "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const toggleProduct = (name: string) =>
    setForm((f) => ({
      ...f,
      products: f.products.includes(name)
        ? f.products.filter((p) => p !== name)
        : [...f.products, name],
    }));

  async function submit() {
    setErr("");
    if (!form.full_name || !form.email || !form.phone) {
      setErr("Please fill in your name, email and phone.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setStatus("done");
    } catch (e: any) {
      setErr(e.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card-luxe flex flex-col items-center p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="mt-6 font-display text-2xl font-semibold text-cream">
          Request received
        </h3>
        <p className="mt-3 max-w-md text-cream/65">
          Thank you. Our team will review your project and get back to you with a tailored
          quotation shortly. A confirmation has been sent to your email.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-cream placeholder-cream/35 outline-none transition focus:border-gold/60 focus:bg-white/[0.05]";
  const label = "mb-2 block text-sm font-medium text-cream/80";

  return (
    <div className="card-luxe p-8 md:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Full name *</label>
          <input className={input} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className={label}>Phone *</label>
          <input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="07xx xxx xxx" />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
        </div>
        <div>
          <label className={label}>Company (optional)</label>
          <input className={input} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company / firm" />
        </div>
      </div>

      <div className="mt-6">
        <label className={label}>I am a…</label>
        <div className="flex flex-wrap gap-3">
          {CUSTOMER_TYPES.map((c) => (
            <button
              key={c.v}
              type="button"
              onClick={() => set("customer_type", c.v)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                form.customer_type === c.v
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/10 text-cream/70 hover:border-gold/40"
              }`}
            >
              {c.l}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className={label}>Products needed</label>
        <div className="flex flex-wrap gap-3">
          {PRODUCTS.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => toggleProduct(p.name)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                form.products.includes(p.name)
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/10 text-cream/70 hover:border-gold/40"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Project type</label>
          <input className={input} value={form.project_type} onChange={(e) => set("project_type", e.target.value)} placeholder="e.g. Apartment block, home renovation" />
        </div>
        <div>
          <label className={label}>Location</label>
          <input className={input} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Kitengela, Nairobi" />
        </div>
      </div>

      <div className="mt-6">
        <label className={label}>Estimated budget</label>
        <div className="flex flex-wrap gap-3">
          {BUDGETS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => set("budget_range", b)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                form.budget_range === b
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/10 text-cream/70 hover:border-gold/40"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className={label}>Project details</label>
        <textarea className={`${input} min-h-28 resize-y`} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us about quantities, timelines, or anything specific…" />
      </div>

      {form.referral_code && (
        <p className="mt-4 text-sm text-gold/80">Referral code applied: <strong>{form.referral_code}</strong></p>
      )}

      {err && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{err}</p>}

      <button onClick={submit} disabled={status === "loading"} className="btn-gold group mt-8 w-full sm:w-auto">
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Submit Quote Request
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
}
