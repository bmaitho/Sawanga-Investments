"use client";
import { Fragment, useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Loader2, Wallet, X } from "lucide-react";
import { KES, ACCOUNT_MANAGERS, PAYMENT_METHODS, agingBucket, agingDays, type Transaction } from "@/lib/transactions";

const bucketColor: Record<string, string> = {
  current: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  red: "text-red-400 bg-red-400/10 border-red-400/20",
};
const bucketLabel: Record<string, string> = { current: "Current", amber: "15+ Days", red: "30+ Days" };

export default function PaymentsTracker({
  transactions, adminKey, onRefresh,
}: {
  transactions: Transaction[];
  adminKey?: string;
  onRefresh?: () => Promise<void> | void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  const [payTxn, setPayTxn] = useState<Transaction | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const optionDarkStyle = { backgroundColor: "#0d1f4a", color: "#f3f0e8" };
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
          <option value="all" style={optionDarkStyle}>All statuses</option>
          <option value="current" style={optionDarkStyle}>Current</option>
          <option value="amber" style={optionDarkStyle}>15+ Days</option>
          <option value="red" style={optionDarkStyle}>30+ Days</option>
        </select>
        <select style={{ colorScheme: "dark" }} value={managerFilter} onChange={(e) => setManagerFilter(e.target.value)} className={inputCls}>
          <option value="all" style={optionDarkStyle}>All managers</option>
          {ACCOUNT_MANAGERS.map((m) => <option key={m} value={m} style={optionDarkStyle}>{m}</option>)}
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
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={11} className="px-4 py-6 text-center text-cream/40">No matching transactions.</td></tr>
              )}
              {rows.map((r) => (
                <Fragment key={r.t.id}>
                <tr className="border-t border-white/8">
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
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setExpandedId(expandedId === r.t.id ? null : r.t.id!)}
                        title={expandedId === r.t.id ? "Hide payment history" : "View payment history"}
                        className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-semibold text-cream/60 transition hover:bg-white/[0.08] hover:text-cream"
                      >
                        {expandedId === r.t.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        History
                      </button>
                      <button
                        onClick={() => setPayTxn(r.t)}
                        disabled={r.balance <= 0}
                        title={r.balance <= 0 ? "Fully paid" : "Record a payment"}
                        className="flex items-center gap-1 rounded-lg border border-gold/30 bg-gold/[0.08] px-2.5 py-1.5 text-[11px] font-semibold text-gold transition hover:bg-gold/15 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Wallet className="h-3 w-3" /> Record
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === r.t.id && (
                  <tr className="border-t border-white/8 bg-white/[0.02]">
                    <td colSpan={11} className="px-4 py-4">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-cream/45">
                        Payment history · {r.t.ref}
                      </p>
                      <div className="overflow-hidden rounded-lg border border-white/10">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-cream/50">
                            <tr>
                              <th className="px-4 py-2">Date</th>
                              <th className="px-4 py-2">Method</th>
                              <th className="px-4 py-2">Note</th>
                              <th className="px-4 py-2 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(!r.t.transaction_payments || r.t.transaction_payments.length === 0) && (
                              <tr><td colSpan={4} className="px-4 py-4 text-center text-cream/40">No payments recorded yet.</td></tr>
                            )}
                            {(r.t.transaction_payments || []).map((p: any) => (
                              <tr key={p.id} className="border-t border-white/8">
                                <td className="px-4 py-2 text-cream/60">{p.created_at ? new Date(p.created_at).toLocaleDateString("en-KE") : "—"}</td>
                                <td className="px-4 py-2 capitalize text-cream/70">{p.method === "mpesa" ? "M-Pesa" : p.method}</td>
                                <td className="px-4 py-2 text-cream/45">{p.note || "—"}</td>
                                <td className="px-4 py-2 text-right font-semibold text-emerald-400">
                                  <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> {KES(p.amount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="border-t border-gold/20 bg-gold/[0.05] font-semibold text-cream">
                  <td className="px-4 py-3" colSpan={5}>Totals ({rows.length} transactions)</td>
                  <td className="px-4 py-3 text-right">{KES(totals.invoiced)}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">{KES(totals.collected)}</td>
                  <td className="px-4 py-3 text-right">{KES(totals.outstanding)}</td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {payTxn && (
        <RecordPaymentModal
          transaction={payTxn}
          adminKey={adminKey}
          onClose={() => setPayTxn(null)}
          onSaved={async () => {
            setPayTxn(null);
            if (onRefresh) await onRefresh();
          }}
        />
      )}
    </div>
  );
}

function RecordPaymentModal({
  transaction, adminKey, onClose, onSaved,
}: {
  transaction: Transaction;
  adminKey?: string;
  onClose: () => void;
  onSaved: () => Promise<void> | void;
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const balance = (transaction.total || 0) - (transaction.amount_paid || 0);
  const optionDarkStyle = { backgroundColor: "#0d1f4a", color: "#f3f0e8" };
  const inputCls =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-cream placeholder-cream/30 outline-none transition focus:border-gold/60";

  async function record() {
    const amt = Number(amount);
    if (!amt || amt <= 0) { setErr("Enter a valid amount."); return; }
    setSaving(true);
    setErr("");
    try {
      const res = await fetch(`/api/admin/transactions/${transaction.id}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminKey, amount: amt, method, note }),
      });
      if (!res.ok) throw new Error("Could not record payment.");
      await onSaved();
    } catch (e: any) {
      setErr(e.message || "Could not record payment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="card-luxe w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-display text-lg font-semibold text-cream">Record a payment</h4>
            <p className="text-xs text-cream/45">{transaction.ref} · {transaction.client_name}</p>
          </div>
          <button onClick={onClose} className="text-cream/40 hover:text-cream/70"><X className="h-5 w-5" /></button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-cream/40">Balance due</p>
            <p className="font-semibold text-cream">{KES(balance)}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-cream/40">Paid to date</p>
            <p className="font-semibold text-emerald-400">{KES(transaction.amount_paid || 0)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Amount (KES)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} placeholder="e.g. 50000" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Method</label>
            <select style={{ colorScheme: "dark" }} value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m} style={optionDarkStyle}>{m === "mpesa" ? "M-Pesa" : m}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Note (optional)</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} placeholder="e.g. Bank ref, part payment…" />
          </div>
        </div>

        {err && <p className="mt-3 text-xs text-red-300">{err}</p>}

        <button onClick={record} disabled={saving} className="btn-gold mt-5 w-full justify-center text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Wallet className="h-4 w-4" /> Record payment</>}
        </button>
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
