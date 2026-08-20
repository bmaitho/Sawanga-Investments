"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
    } else {
      setError("Incorrect password. Try again.");
      setPassword("");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 p-6">
      <div className="absolute inset-0 grid-texture opacity-30" />
      <div className="relative w-full max-w-sm">
        <div className="card-luxe border-gold/20 p-8">
          <div className="flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/15 text-gold">
              <Lock className="h-7 w-7" />
            </div>
          </div>
          <h1 className="mt-5 text-center font-display text-2xl font-semibold text-cream">
            Admin Login
          </h1>
          <p className="mt-2 text-center text-sm text-cream/45">
            SAWANGA Investment Limited
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-11 text-cream placeholder-cream/30 outline-none transition focus:border-gold/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-900/50 transition hover:text-navy-900/80"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && (
              <p className="rounded-lg bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="btn-gold w-full justify-center disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
