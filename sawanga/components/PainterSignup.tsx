"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function genCode() {
  return "SAW-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function PainterSignup() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    county: "",
    id_number: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setErr("");
    if (!form.full_name || !form.phone || !form.email || !form.password) {
      setErr("Please fill in all required fields.");
      return;
    }
    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    setStatus("loading");
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      const uid = data.user?.id;
      if (!uid) throw new Error("Could not create account.");

      const { error: pErr } = await supabase.from("painters").insert({
        id: uid,
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        county: form.county || null,
        id_number: form.id_number || null,
        referral_code: genCode(),
      });
      if (pErr) throw pErr;

      // If email confirmation is OFF, session exists -> go to dashboard
      if (data.session) {
        router.push("/painter-portal/dashboard");
        router.refresh();
      } else {
        setStatus("done");
      }
    } catch (e: any) {
      setErr(e.message || "Sign-up failed. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card-luxe flex flex-col items-center p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="mt-6 font-display text-2xl font-semibold text-cream">Account created</h3>
        <p className="mt-3 max-w-sm text-cream/65">
          Please check your email to confirm your account, then log in to your painter dashboard.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-cream placeholder-cream/35 outline-none transition focus:border-gold/60 focus:bg-white/[0.05]";
  const label = "mb-2 block text-sm font-medium text-cream/80";

  return (
    <div className="card-luxe border-gold/25 p-8">
      <h3 className="font-display text-2xl font-semibold text-cream">Join the painter network</h3>
      <p className="mt-2 text-sm text-cream/60">Free to register. Start referring today.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className={label}>Full name *</label>
          <input className={input} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Your name" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Phone *</label>
            <input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="07xx xxx xxx" />
          </div>
          <div>
            <label className={label}>County</label>
            <input className={input} value={form.county} onChange={(e) => set("county", e.target.value)} placeholder="e.g. Kajiado" />
          </div>
        </div>
        <div>
          <label className={label}>ID number (optional)</label>
          <input className={input} value={form.id_number} onChange={(e) => set("id_number", e.target.value)} placeholder="National ID" />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
        </div>
        <div>
          <label className={label}>Password *</label>
          <input className={input} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="At least 6 characters" />
        </div>
      </div>

      {err && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{err}</p>}

      <button onClick={submit} disabled={status === "loading"} className="btn-gold group mt-6 w-full">
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
          </>
        ) : (
          <>
            Create my account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
}
