"use client";
import { useState } from "react";
import {
  CheckCircle2, XCircle, Clock, Users, Wallet,
  RefreshCw, ChevronDown, ChevronUp, BadgeCheck,
} from "lucide-react";

const KES = (n: number) =>
  "KES " + Number(n || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 });

const statusColor: Record<string, string> = {
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  paid:      "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  pending:   "text-gold bg-gold/10 border-gold/20",
  requested: "text-gold bg-gold/10 border-gold/20",
  rejected:  "text-red-400 bg-red-400/10 border-red-400/20",
  processing:"text-sky-400 bg-sky-400/10 border-sky-400/20",
};

type Tab = "referrals" | "painters" | "redemptions";

export default function AdminClient({
  referrals, painters, redemptions, adminKey,
}: {
  referrals: any[];
  painters: any[];
  redemptions: any[];
  adminKey: string;
}) {
  const [tab, setTab] = useState<Tab>("referrals");
  const [loading, setLoading] = useState<string | null>(null);
  const [localReferrals, setLocalReferrals] = useState(referrals);
  const [localRedemptions, setLocalRedemptions] = useState(redemptions);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pending = localReferrals.filter((r) => r.status === "pending");
  const pendingRedemptions = localRedemptions.filter((r) => r.status === "requested");

  async function approveReferral(id: string, saleValue: number) {
    setLoading(id);
    const res = await fetch("/api/admin/approve-referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminKey }),
    });
    setLoading(null);
    if (res.ok) {
      setLocalReferrals((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: "approved" } : r)
      );
    } else {
      alert("Failed to approve. Check console.");
    }
  }

  async function rejectReferral(id: string) {
    setLoading(id + "-reject");
    const res = await fetch("/api/admin/reject-referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, adminKey }),
    });
    setLoading(null);
    if (res.ok) {
      setLocalReferrals((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r)
      );
    }
  }

  async function markPaid(id: string, painterId: string, amount: number) {
    setLoading(id + "-paid");
    const res = await fetch("/api/admin/mark-paid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, painterId, amount, adminKey }),
    });
    setLoading(null);
    if (res.ok) {
      setLocalRedemptions((prev) =>
        prev.map((r) => r.id === id ? { ...r, status: "paid" } : r)
      );
    }
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "referrals",   label: "Referrals",   count: pending.length },
    { id: "painters",    label: "Painters",     count: painters.length },
    { id: "redemptions", label: "Redemptions",  count: pendingRedemptions.length },
  ];

  return (
    <div className="min-h-screen bg-navy-900 pt-28">
      <div className="absolute inset-0 grid-texture opacity-30 pointer-events-none" />
      <div className="container-luxe relative pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-cream">
              SAWANGA <span className="gold-text">Admin</span>
            </h1>
            <p className="mt-1 text-sm text-cream/45">Painter portal management</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-outline gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Clock,        label: "Pending referrals",   value: pending.length,            gold: true },
            { icon: Users,        label: "Registered painters", value: painters.length,           gold: false },
            { icon: Wallet,       label: "Pending payouts",     value: pendingRedemptions.length, gold: pendingRedemptions.length > 0 },
          ].map((s) => (
            <div key={s.label} className="card-luxe p-6">
              <s.icon className={`h-7 w-7 ${s.gold ? "text-gold" : "text-cream/40"}`} />
              <div className={`mt-3 font-display text-3xl font-semibold ${s.gold ? "gold-text" : "text-cream"}`}>
                {s.value}
              </div>
              <div className="mt-1 text-sm text-cream/50">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-white/10 pb-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-t-xl border border-b-0 px-5 py-3 text-sm font-medium transition ${
                tab === t.id
                  ? "border-gold/30 bg-white/[0.06] text-cream"
                  : "border-transparent text-cream/45 hover:text-cream/70"
              }`}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-bold text-gold">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── REFERRALS TAB ─────────────────────────────────────────────── */}
        {tab === "referrals" && (
          <div className="mt-6 space-y-3">
            {localReferrals.length === 0 && (
              <p className="card-luxe p-8 text-center text-cream/45">No referrals yet.</p>
            )}
            {localReferrals.map((r) => {
              const isExpanded = expandedId === r.id;
              const isPending = r.status === "pending";
              return (
                <div key={r.id} className={`card-luxe overflow-hidden transition ${isPending ? "border-gold/20" : ""}`}>
                  {/* Row */}
                  <div className="flex flex-wrap items-center gap-4 p-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-cream">{r.client_name}</span>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[r.status] || "text-cream/50 bg-white/5 border-white/10"}`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-3 text-xs text-cream/45">
                        <span>{r.client_phone}</span>
                        <span>·</span>
                        <span className="font-medium text-cream/60">
                          by {r.painters?.full_name || "Unknown painter"}
                        </span>
                        <span>·</span>
                        <span>{new Date(r.created_at).toLocaleDateString("en-KE")}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-cream">
                        {r.sale_value > 0 ? KES(r.sale_value) : "—"}
                      </div>
                      <div className="text-xs text-gold">
                        {r.points_awarded > 0 ? `+${KES(r.points_awarded)}` : "commission pending"}
                      </div>
                    </div>

                    {/* Actions */}
                    {isPending && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveReferral(r.id, r.sale_value)}
                          disabled={loading === r.id}
                          className="flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-400/20 disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {loading === r.id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => rejectReferral(r.id)}
                          disabled={loading === r.id + "-reject"}
                          className="flex items-center gap-1.5 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-400/20 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                          {loading === r.id + "-reject" ? "..." : "Reject"}
                        </button>
                      </div>
                    )}

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
                      className="text-cream/30 hover:text-cream/60"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && r.project_detail && (
                    <div className="border-t border-white/8 bg-white/[0.02] px-5 py-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-cream/40">Order detail</p>
                      <p className="mt-2 text-sm leading-relaxed text-cream/70">{r.project_detail}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── PAINTERS TAB ──────────────────────────────────────────────── */}
        {tab === "painters" && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.04] text-cream/50">
                <tr>
                  <th className="px-5 py-3 font-medium">Painter</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">County</th>
                  <th className="px-5 py-3 font-medium">Referral code</th>
                  <th className="px-5 py-3 text-right font-medium">Balance</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {painters.map((p) => (
                  <tr key={p.id} className="border-t border-white/8 hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <div className="font-medium text-cream">{p.full_name}</div>
                      <div className="text-xs text-cream/40">{p.email}</div>
                    </td>
                    <td className="px-5 py-4 text-cream/60">{p.phone}</td>
                    <td className="px-5 py-4 capitalize text-cream/60">{p.county || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-gold/10 px-3 py-1 font-mono text-xs font-semibold text-gold">
                        {p.referral_code || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-cream">
                      {KES(p.reward_points || 0)}
                    </td>
                    <td className="px-5 py-4 text-cream/40 text-xs">
                      {new Date(p.created_at).toLocaleDateString("en-KE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {painters.length === 0 && (
              <p className="p-8 text-center text-cream/45">No painters registered yet.</p>
            )}
          </div>
        )}

        {/* ── REDEMPTIONS TAB ───────────────────────────────────────────── */}
        {tab === "redemptions" && (
          <div className="mt-6 space-y-3">
            {localRedemptions.length === 0 && (
              <p className="card-luxe p-8 text-center text-cream/45">No redemption requests yet.</p>
            )}
            {localRedemptions.map((r) => (
              <div key={r.id} className={`card-luxe flex flex-wrap items-center gap-4 p-5 ${r.status === "requested" ? "border-gold/20" : ""}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-cream">{r.painters?.full_name || "Unknown"}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[r.status] || "text-cream/50 bg-white/5 border-white/10"}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-cream/45">
                    <span>{r.painters?.phone}</span>
                    <span>·</span>
                    <span className="capitalize">{r.method === "mpesa" ? "M-Pesa" : r.method}</span>
                    <span>·</span>
                    <span>{new Date(r.created_at).toLocaleDateString("en-KE")}</span>
                  </div>
                </div>

                <div className="font-display text-2xl font-semibold gold-text">
                  {KES(r.amount)}
                </div>

                {r.status === "requested" && (
                  <button
                    onClick={() => markPaid(r.id, r.painter_id, r.amount)}
                    disabled={loading === r.id + "-paid"}
                    className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-400/20 disabled:opacity-50"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {loading === r.id + "-paid" ? "Processing..." : "Mark as paid"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
