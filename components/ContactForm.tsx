"use client";
import { useState } from "react";
import { Check, Loader2, ArrowRight } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setErr("");
    if (!form.full_name || !form.email || !form.message) {
      setErr("Please fill in your name, email and message.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setStatus("done");
    } catch (e: any) {
      setErr(e.message || "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card-luxe flex flex-col items-center p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="mt-6 font-display text-2xl font-semibold text-cream">Message sent</h3>
        <p className="mt-3 max-w-md text-cream/65">
          Thanks for reaching out. We&apos;ve received your message and will respond as soon as
          possible.
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
          <label className={label}>Phone</label>
          <input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="07xx xxx xxx" />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
        </div>
        <div>
          <label className={label}>Subject</label>
          <input className={input} value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="How can we help?" />
        </div>
      </div>
      <div className="mt-5">
        <label className={label}>Message *</label>
        <textarea className={`${input} min-h-36 resize-y`} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Write your message…" />
      </div>

      {err && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{err}</p>}

      <button onClick={submit} disabled={status === "loading"} className="btn-gold group mt-8 w-full sm:w-auto">
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send Message
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
}
