"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
  Users,
  Clock,
  CheckCircle2,
  Copy,
  LogOut,
  Plus,
  Loader2,
  Share2,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";

const KES = (n: number) =>
  "KES " + Number(n || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 });

const statusColor: Record<string, string> = {
  approved: "text-emerald-400 bg-emerald-400/10",
  paid: "text-emerald-400 bg-emerald-400/10",
  pending: "text-gold bg-gold/10",
  requested: "text-gold bg-gold/10",
  processing: "text-sky-400 bg-sky-400/10",
  rejected: "text-red-400 bg-red-400/10",
};

export default function DashboardClient({
  painter,
  referrals,
  redemptions,
}: {
  painter: any;
  referrals: any[];
  redemptions: any[];
}) {
  const router = useRouter();
  const [showRefer, setShowRefer] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [copied, setCopied] = useState(false);

  const approved = referrals.filter((r) => r.status === "approved" || r.status === "paid");
  const pending = referrals.filter((r) => r.status === "pending");

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/painter-portal/login");
    router.refresh();
  }

  function copyCode() {
    navigator.clipboard.writeText(painter?.referral_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/quote?ref=${painter?.referral_code}`
      : "";

  if (!painter) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20 text-cream/70">
        Setting up your profile… please refresh.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-28">
      <div className="absolute inset-0 grid-texture opacity-40" />
      <div className="container-luxe relative pb-24">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo className="h-12 w-12" />
            <div>
              <h1 className="font-display text-2xl font-semibold text-cream">
                Welcome, {painter.full_name.split(" ")[0]}
              </h1>
              <p className="text-sm text-cream/55">Your painter dashboard</p>
            </div>
          </div>
          <button onClick={logout} className="btn-outline">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>

        {/* referral code card */}
        <div className="card-luxe mt-8 flex flex-col items-start justify-between gap-4 border-gold/25 p-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Share2 className="h-6 w-6 text-gold" />
            <div>
              <p className="text-sm text-cream/60">Your referral code</p>
              <p className="font-display text-2xl font-semibold gold-text">
                {painter.referral_code}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={copyCode} className="btn-outline">
              <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy code"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Get quality finishing products from SAWANGA Investment. Use my referral when you request a quote: ${referralLink}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              Share link
            </a>
          </div>
        </div>

        {/* stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Wallet, label: "Reward balance", value: KES(painter.total_points), gold: true },
            { icon: Users, label: "Total referrals", value: referrals.length },
            { icon: CheckCircle2, label: "Approved", value: approved.length },
            { icon: Clock, label: "Pending", value: pending.length },
          ].map((s) => (
            <div key={s.label} className="card-luxe p-6">
              <s.icon className={`h-7 w-7 ${s.gold ? "text-gold" : "text-cream/50"}`} />
              <div className={`mt-3 font-display text-2xl font-semibold ${s.gold ? "gold-text" : "text-cream"}`}>
                {s.value}
              </div>
              <div className="mt-1 text-sm text-cream/55">{s.label}</div>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => setShowRefer(true)} className="btn-gold">
            <Plus className="h-4 w-4" /> Refer a client
          </button>
          <button
            onClick={() => setShowRedeem(true)}
            disabled={Number(painter.total_points) <= 0}
            className="btn-outline disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Wallet className="h-4 w-4" /> Redeem rewards
          </button>
        </div>

        {/* referrals table */}
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-cream">Your referrals</h2>
          {referrals.length === 0 ? (
            <p className="card-luxe mt-4 p-8 text-center text-cream/55">
              No referrals yet. Click &quot;Refer a client&quot; to get started.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-cream/60">
                  <tr>
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium">Project</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-t border-white/10">
                      <td className="px-5 py-4 text-cream/85">{r.client_name}</td>
                      <td className="px-5 py-4 text-cream/60">{r.project_detail || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[r.status] || "text-cream/60 bg-white/5"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-cream">
                        {r.points_awarded > 0 ? KES(r.points_awarded) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* redemptions */}
        {redemptions.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-cream">Redemption history</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-cream/60">
                  <tr>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Method</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((r) => (
                    <tr key={r.id} className="border-t border-white/10">
                      <td className="px-5 py-4 font-semibold text-cream">{KES(r.amount)}</td>
                      <td className="px-5 py-4 capitalize text-cream/60">{r.method}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[r.status] || "text-cream/60 bg-white/5"}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showRefer && <ReferModal onClose={() => setShowRefer(false)} onDone={() => { setShowRefer(false); router.refresh(); }} />}
      {showRedeem && (
        <RedeemModal
          balance={Number(painter.total_points)}
          onClose={() => setShowRedeem(false)}
          onDone={() => { setShowRedeem(false); router.refresh(); }}
        />
      )}
    </div>
  );
}

function Modal({ children, onClose, title }: any) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/80 p-4 backdrop-blur-sm">
      <div className="card-luxe relative w-full max-w-md border-gold/25 bg-navy-800 p-8">
        <button onClick={onClose} className="absolute right-5 top-5 text-cream/50 hover:text-gold">
          <X className="h-5 w-5" />
        </button>
        <h3 className="font-display text-2xl font-semibold text-cream">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function ReferModal({ onClose, onDone }: any) {
  const [f, setF] = useState({ client_name: "", client_phone: "", project_detail: "", est_value: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-cream placeholder-cream/35 outline-none transition focus:border-gold/60";

  async function submit() {
    setErr("");
    if (!f.client_name || !f.client_phone) {
      setErr("Client name and phone are required.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    setLoading(false);
    if (!res.ok) {
      setErr((await res.json()).error || "Failed.");
      return;
    }
    onDone();
  }

  return (
    <Modal onClose={onClose} title="Refer a client">
      <div className="mt-5 space-y-4">
        <input className={input} placeholder="Client name *" value={f.client_name} onChange={(e) => setF({ ...f, client_name: e.target.value })} />
        <input className={input} placeholder="Client phone *" value={f.client_phone} onChange={(e) => setF({ ...f, client_phone: e.target.value })} />
        <input className={input} placeholder="Project detail (e.g. 3-bedroom repaint)" value={f.project_detail} onChange={(e) => setF({ ...f, project_detail: e.target.value })} />
        <input className={input} placeholder="Estimated value (KES, optional)" value={f.est_value} onChange={(e) => setF({ ...f, est_value: e.target.value })} />
      </div>
      {err && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{err}</p>}
      <button onClick={submit} disabled={loading} className="btn-gold mt-6 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit referral"}
      </button>
    </Modal>
  );
}

function RedeemModal({ balance, onClose, onDone }: any) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-cream placeholder-cream/35 outline-none transition focus:border-gold/60";

  async function submit() {
    setErr("");
    const amt = Number(amount);
    if (!amt || amt <= 0) return setErr("Enter a valid amount.");
    if (amt > balance) return setErr("Amount exceeds your balance.");
    setLoading(true);
    const res = await fetch("/api/redemptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amt, method }),
    });
    setLoading(false);
    if (!res.ok) return setErr((await res.json()).error || "Failed.");
    onDone();
  }

  return (
    <Modal onClose={onClose} title="Redeem rewards">
      <p className="mt-2 text-sm text-cream/60">Available balance: {KES(balance)}</p>
      <div className="mt-5 space-y-4">
        <input className={input} placeholder="Amount (KES)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="flex gap-3">
          {["mpesa", "bank", "credit"].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition ${
                method === m ? "border-gold bg-gold/15 text-gold" : "border-white/10 text-cream/70"
              }`}
            >
              {m === "mpesa" ? "M-Pesa" : m}
            </button>
          ))}
        </div>
      </div>
      {err && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{err}</p>}
      <button onClick={submit} disabled={loading} className="btn-gold mt-6 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request payout"}
      </button>
    </Modal>
  );
}
