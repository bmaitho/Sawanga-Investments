"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

export default function PainterLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function login() {
    setErr("");
    if (!email || !password) {
      setErr("Enter your email and password.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push("/painter-portal/dashboard");
    router.refresh();
  }

  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-cream placeholder-cream/35 outline-none transition focus:border-gold/60 focus:bg-white/[0.05]";
  const label = "mb-2 block text-sm font-medium text-cream/80";

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden py-32">
      <div className="absolute inset-0 grid-texture opacity-50" />
      <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-gold/10 blur-[110px]" />
      <div className="container-luxe relative max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="h-14 w-14" />
          <h1 className="mt-4 font-display text-3xl font-semibold text-cream">Painter Login</h1>
          <p className="mt-2 text-sm text-cream/60">Access your referral dashboard.</p>
        </div>

        <div className="card-luxe border-gold/25 p-8">
          <div className="space-y-4">
            <div>
              <label className={label}>Email</label>
              <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" onKeyDown={(e) => e.key === "Enter" && login()} />
            </div>
            <div>
              <label className={label}>Password</label>
              <input className={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" onKeyDown={(e) => e.key === "Enter" && login()} />
            </div>
          </div>

          {err && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{err}</p>}

          <button onClick={login} disabled={loading} className="btn-gold group mt-6 w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Logging in…
              </>
            ) : (
              <>
                Log in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-cream/60">
          New here?{" "}
          <Link href="/painter-portal#register" className="font-semibold text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
