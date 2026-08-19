"use client";
import { useMemo, useState } from "react";
import { KES, ACCOUNT_MANAGERS, agingBucket, agingDays, type Transaction } from "@/lib/transactions";

const bucketColor: Record<string, string> = {
  current: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  red: "text-red-400 bg-red-400/10 border-red-400/20",
};
const bucketLabel: Record<string, string> = { current: "Current", amber: "15+ Days", red: "30+ Days" };

export default function PaymentsTracker({ transactions }: { transactions: Transaction[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");

  // Only stages that have actually been invoiced count towards payments tracking.
  const invoiced = useMemo(
    () => transactions.filter((t) => t.stage === "invoice" || t.stage === "delivery"),
    [transactions]
  );

  const rows = useMemo(() => {
    return invoiced
      .map((t) => {
        const total = t.total || 0;
        const paid = t.amount_paid || 0;
        const balance = total - paid;
        const bucket = agingBucket(t.quote_date, balance);
        return { t, total, paid, balance, bucket, age: agingDays(t.quote_date) };
      })
      .filter((r) => {
        if (managerFilter !== "all" && r.t.account_manager !== managerFilter) return false;
        if (statusFilter !== "all" && r.bucket !== statusFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          const hay = `${r.t.client_name} ${r.t.client_company || ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      });
  }, [invoiced, search, statusFilter, managerFilter]);

  const totals = rows.reduce(
    (acc, r) => {
      acc.invoiced += r.total;
      acc.collected += r.paid;
      acc.outstanding += r.balance;
      if (r.bucket === "amber") acc.amber += r.balance;
      if (r.bucket === "red") acc.red += r.balance;
      return acc;
    },
    { invoiced: 0, collected: 0, outstanding: 0, amber: 0, red: 0 }
  );

  // Per-client summary
  const byClient = useMemo(() => {
    const map = new Map<string, { client: string; company: string; count: number; invoiced: number; paid: number; balance: number; bucket: string }>();
    rows.forEach((r) => {
      const key = r.t.client_name + "|" + (r.t.client_company || "");
      const cur = map.get(key) || {
        client: r.t.client_name, company: r.t.client_company || "", count: 0, invoiced: 0, paid: 0, balance: 0, bucket: "current",
      };
      cur.count += 1;
      cur.invoiced += r.total;
      cur.paid += r.paid;
      cur.balance += r.balance;
      if (r.bucket === "red" || cur.bucket === "red") cur.bucket = "red";
      else if (r.bucket === "amber" || cur.bucket === "amber") cur.bucket = "amber";
      map.set(key, cur);
    });
    return Array.from(map.values());
  }, [rows]);

  const inputCls =
    "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-cream placeholder-cream/30 outline-none transition focus:border-gold/60";

  return (
    <div className="mt-6 space-y-6">
      <div className="card-luxe flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-cream">Payments Tracker</h3>
          <p className="text-sm text-cream/45">Consolidated · Per-client · Aging analysis</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {(["current", "amber", "red"] as const).map((b) => (
            <span key={b} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${b === "current" ? "bg-emerald-400" : b === "amber" ? "bg-amber-400" : "bg-red-400"}`} />
              <span className="text-cream/55">{bucketLabel[b]}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card label="Total invoiced" value={KES(totals.invoiced)} />
        <Card label="Total collected" value={KES(totals.collected)} tone="emerald" />
        <Card label="Total outstanding" value={KES(totals.outstanding)} tone="gold" />
        <Card label="Amber (15+ days)" value={KES(totals.amber)} tone="amber" />
        <Card label="Red (30+ days)" value={KES(totals.red)} tone="red" />
      </div>

      {/* Filters */}
      <div className="card-luxe flex flex-wrap items-center gap-3 p-5">
        <input
          placeholder="Search client / company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputCls} flex-1 min-w-[200px]`}
        />
        <select style={{ colorScheme: "dark" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputCls}>
          <option value="all">All statuses</option>
          <option value="current">Current</option>
          <option value="amber">15+ Days</option>
          <option value="red">30+ Days</option>
        </select>
        <select style={{ colorScheme: "dark" }} value={managerFilter} onChange={(e) => setManagerFilter(e.target.value)} className={inputCls}>
          <option value="all">All managers</option>
          {ACCOUNT_MANAGERS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Client summary */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cream/45">Client summary</p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-cream/50">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3 text-right">Transactions</th>
                <th className="px-4 py-3 text-right">Total invoiced</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {byClient.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-cream/40">No invoiced transactions yet.</td></tr>
              )}
              {byClient.map((c, i) => (
                <tr key={i} className="border-t border-white/8">
                  <td className="px-4 py-3 font-medium text-cream">{c.client}</td>
                  <td className="px-4 py-3 text-cream/50">{c.company || "—"}</td>
                  <td className="px-4 py-3 text-right text-cream/60">{c.count}</td>
                  <td className="px-4 py-3 text-right text-cream">{KES(c.invoiced)}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">{KES(c.paid)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-cream">{KES(c.balance)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${bucketColor[c.bucket]}`}>
                      {bucketLabel[c.bucket]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All transactions */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cream/45">All transactions</p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-cream/50">
              <tr>
                <th className="px-4 py-3">Ref</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Invoice date</th>
                <th className="px-4 py-3 text-right">Age (days)</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Account mgr</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-6 text-center text-cream/40">No matching transactions.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.t.id} className="border-t border-white/8">
                  <td className="px-4 py-3 font-mono text-xs text-gold">{r.t.ref}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-cream">{r.t.client_name}</div>
                    <div className="text-xs text-cream/40">{r.t.client_company}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase text-cream/60">{r.t.stage}</span>
                  </td>
                  <td className="px-4 py-3 text-cream/60">{new Date(r.t.quote_date).toLocaleDateString("en-KE")}</td>
                  <td className="px-4 py-3 text-right text-cream/60">{r.age}d</td>
                  <td className="px-4 py-3 text-right text-cream">{KES(r.total)}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">{KES(r.paid)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-cream">{KES(r.balance)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${bucketColor[r.bucket]}`}>
                      {bucketLabel[r.bucket]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-cream/50">{r.t.account_manager || "—"}</td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="border-t border-gold/20 bg-gold/[0.05] font-semibold text-cream">
                  <td className="px-4 py-3" colSpan={5}>Totals ({rows.length} transactions)</td>
                  <td className="px-4 py-3 text-right">{KES(totals.invoiced)}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">{KES(totals.collected)}</td>
                  <td className="px-4 py-3 text-right">{KES(totals.outstanding)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, tone }: { label: string; value: string; tone?: "emerald" | "gold" | "amber" | "red" }) {
  const toneCls =
    tone === "emerald" ? "text-emerald-400" :
    tone === "amber" ? "text-amber-400" :
    tone === "red" ? "text-red-400" :
    tone === "gold" ? "gold-text" : "text-cream";
  return (
    <div className="card-luxe p-5">
      <p className="text-xs uppercase tracking-wide text-cream/45">{label}</p>
      <p className={`mt-2 font-display text-xl font-semibold ${toneCls}`}>{value}</p>
    </div>
  );
}
