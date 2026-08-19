"use client";
import { useState } from "react";
import {
  Plus, Printer, Trash2, ChevronRight, Loader2, X, CheckCircle2, Wallet,
} from "lucide-react";
import {
  KES, UNITS, ACCOUNT_MANAGERS, PAYMENT_METHODS, computeTotals, agingBucket,
  agingDays, newBlankItem, type Transaction, type TransactionItem,
} from "@/lib/transactions";

const bucketColor: Record<string, string> = {
  current: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  red: "text-red-400 bg-red-400/10 border-red-400/20",
};
const bucketLabel: Record<string, string> = { current: "Current", amber: "15+ Days", red: "30+ Days" };

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-cream placeholder-cream/30 outline-none transition focus:border-gold/60 disabled:opacity-50 disabled:cursor-not-allowed";
const labelCls = "mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45";

type SubTab = "quotation" | "invoice" | "delivery" | "payments";

export default function TransactionsPanel({
  transactions, adminKey, onRefresh,
}: {
  transactions: Transaction[];
  adminKey: string;
  onRefresh: () => Promise<void> | void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(transactions[0]?.id || null);
  const [subTab, setSubTab] = useState<SubTab>("quotation");
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);

  const selected = transactions.find((t) => t.id === selectedId) || null;

  async function createTransaction(fields: Partial<Transaction>) {
    setBusy(true);
    const res = await fetch("/api/admin/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, adminKey }),
    });
    setBusy(false);
    if (res.ok) {
      const d = await res.json();
      await onRefresh();
      setSelectedId(d.transaction.id);
      setSubTab("quotation");
      setShowNew(false);
    } else {
      alert("Could not create transaction.");
    }
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr] print:block">
      {/* ── LIST ─────────────────────────────────────────────── */}
      <div className="card-luxe overflow-hidden print:hidden">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-cream/70">
            Transactions ({transactions.length})
          </h3>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-1 rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-navy-900 transition hover:bg-gold-light"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>
        <div className="max-h-[70vh] divide-y divide-white/8 overflow-y-auto">
          {transactions.length === 0 && (
            <p className="p-6 text-center text-sm text-cream/45">
              No transactions yet. Click &quot;New&quot; to create a quotation.
            </p>
          )}
          {transactions.map((t) => {
            const balance = (t.total || 0) - (t.amount_paid || 0);
            const bucket = agingBucket(t.quote_date, balance);
            return (
              <button
                key={t.id}
                onClick={() => { setSelectedId(t.id!); setSubTab("quotation"); }}
                className={`block w-full px-5 py-4 text-left transition hover:bg-white/[0.04] ${
                  selectedId === t.id ? "bg-white/[0.06]" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-gold">{t.ref}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${bucketColor[bucket]}`}>
                    {bucketLabel[bucket]}
                  </span>
                </div>
                <div className="mt-1 truncate font-medium text-cream">{t.client_name}</div>
                <div className="truncate text-xs text-cream/45">{t.client_company || "—"}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase text-cream/50">
                    {t.stage}
                  </span>
                  <span className="text-sm font-semibold text-cream">{KES(t.total || 0)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DETAIL ───────────────────────────────────────────── */}
      <div className="card-luxe overflow-hidden">
        {!selected ? (
          <div className="flex h-full min-h-[400px] items-center justify-center p-10 text-center text-cream/45">
            Select a transaction, or create a new one to get started.
          </div>
        ) : (
          <TransactionDetail
            key={selected.id}
            transaction={selected}
            adminKey={adminKey}
            subTab={subTab}
            setSubTab={setSubTab}
            onRefresh={onRefresh}
          />
        )}
      </div>

      {showNew && (
        <NewTransactionModal
          busy={busy}
          onClose={() => setShowNew(false)}
          onCreate={createTransaction}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  New transaction modal
// ═══════════════════════════════════════════════════════════════════
function NewTransactionModal({ onClose, onCreate, busy }: any) {
  const [f, setF] = useState({
    client_name: "", client_company: "", client_phone: "", client_email: "",
    project_name: "", account_manager: ACCOUNT_MANAGERS[0],
  });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-900/85 p-4 backdrop-blur-sm">
      <div className="card-luxe relative w-full max-w-lg border-gold/25 bg-[#0d1f4a] p-6 md:p-8">
        <button onClick={onClose} className="absolute right-5 top-5 text-cream/50 hover:text-gold">
          <X className="h-5 w-5" />
        </button>
        <h3 className="font-display text-2xl font-semibold text-cream">New Transaction</h3>
        <p className="mt-1 text-sm text-cream/50">Start a new quotation for a client.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className={labelCls}>Client name *</label>
            <input className={inputCls} value={f.client_name} onChange={(e) => set("client_name", e.target.value)} placeholder="e.g. Kamau Developers" />
          </div>
          <div>
            <label className={labelCls}>Company</label>
            <input className={inputCls} value={f.client_company} onChange={(e) => set("client_company", e.target.value)} placeholder="e.g. Kamau Developers Ltd" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} value={f.client_phone} onChange={(e) => set("client_phone", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input className={inputCls} value={f.client_email} onChange={(e) => set("client_email", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Project</label>
            <input className={inputCls} value={f.project_name} onChange={(e) => set("project_name", e.target.value)} placeholder="e.g. Kilimani Phase 2" />
          </div>
          <div>
            <label className={labelCls}>Prepared by</label>
            <select style={{ colorScheme: "dark" }} className={inputCls} value={f.account_manager} onChange={(e) => set("account_manager", e.target.value)}>
              {ACCOUNT_MANAGERS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={() => f.client_name && onCreate(f)}
          disabled={busy || !f.client_name}
          className="btn-gold mt-8 w-full justify-center disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create quotation"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Transaction detail — stage bar, sub-tabs, editable document
// ═══════════════════════════════════════════════════════════════════
function TransactionDetail({
  transaction, adminKey, subTab, setSubTab, onRefresh,
}: {
  transaction: Transaction; adminKey: string; subTab: SubTab;
  setSubTab: (t: SubTab) => void; onRefresh: () => Promise<void> | void;
}) {
  const [draft, setDraft] = useState<Transaction>(() => JSON.parse(JSON.stringify(transaction)));
  const [saving, setSaving] = useState(false);
  const [advancing, setAdvancing] = useState(false);

  const items: TransactionItem[] = draft.transaction_items?.length
    ? draft.transaction_items
    : [newBlankItem(0)];
  const payments = transaction.transaction_payments || [];
  const totals = computeTotals(items, draft.vat_rate || 16, draft.delivery_fee || 0);
  const balanceDue = totals.total - (transaction.amount_paid || 0);

  const stageIdx = { quote: 0, invoice: 1, delivery: 2 }[transaction.stage];

  function setField<K extends keyof Transaction>(k: K, v: Transaction[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }
  function setItem(i: number, patch: Partial<TransactionItem>) {
    setDraft((d) => {
      const list = [...items];
      list[i] = { ...list[i], ...patch };
      return { ...d, transaction_items: list };
    });
  }
  function addRow() {
    setDraft((d) => ({ ...d, transaction_items: [...items, newBlankItem(items.length)] }));
  }
  function removeRow(i: number) {
    setDraft((d) => ({ ...d, transaction_items: items.filter((_, idx) => idx !== i) }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/transactions/${transaction.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        adminKey,
        client_name: draft.client_name, client_company: draft.client_company,
        client_address: draft.client_address, client_phone: draft.client_phone,
        client_email: draft.client_email, project_name: draft.project_name,
        kra_pin: draft.kra_pin, vat_no: draft.vat_no, quote_date: draft.quote_date,
        valid_days: draft.valid_days, account_manager: draft.account_manager,
        vat_rate: draft.vat_rate, vat_treatment: draft.vat_treatment,
        delivery_fee: draft.delivery_fee, notes: draft.notes,
        dispatched_by: draft.dispatched_by, driver_name: draft.driver_name,
        vehicle: draft.vehicle, received_by: draft.received_by,
        items,
      }),
    });
    setSaving(false);
    if (res.ok) {
      await onRefresh();
    } else {
      alert("Save failed. Please try again.");
    }
  }

  async function advanceStage(nextStage: "invoice" | "delivery") {
    setAdvancing(true);
    await save();
    const res = await fetch(`/api/admin/transactions/${transaction.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey, stage: nextStage }),
    });
    setAdvancing(false);
    if (res.ok) {
      await onRefresh();
      setSubTab(nextStage === "invoice" ? "invoice" : "delivery");
    } else {
      alert("Could not advance stage.");
    }
  }

  const editableQuote = transaction.stage === "quote";
  const canSeeInvoice = stageIdx >= 1;
  const canSeeDelivery = stageIdx >= 1; // can start prepping delivery once invoiced
  const canSeePayments = stageIdx >= 1;

  const tabs: { id: SubTab; label: string; enabled: boolean }[] = [
    { id: "quotation", label: "Quotation", enabled: true },
    { id: "invoice", label: "Invoice", enabled: canSeeInvoice },
    { id: "delivery", label: "Delivery Note", enabled: canSeeDelivery },
    { id: "payments", label: "Payments", enabled: canSeePayments },
  ];

  return (
    <div>
      {/* Top bar: stage + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-6 py-4 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-cream/45">Stage:</span>
          {(["quote", "invoice", "delivery"] as const).map((s) => (
            <span
              key={s}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize ${
                transaction.stage === s
                  ? "border-gold/40 bg-gold/15 text-gold"
                  : "border-white/10 text-cream/35"
              }`}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {transaction.stage === "quote" && (
            <button onClick={() => advanceStage("invoice")} disabled={advancing} className="btn-gold px-4 py-2 text-xs">
              {advancing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Convert to Invoice <ChevronRight className="h-3.5 w-3.5" /></>}
            </button>
          )}
          {transaction.stage === "invoice" && (
            <button onClick={() => advanceStage("delivery")} disabled={advancing} className="btn-gold px-4 py-2 text-xs">
              {advancing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <>Create Delivery Note <ChevronRight className="h-3.5 w-3.5" /></>}
            </button>
          )}
          <button onClick={() => window.print()} className="btn-outline px-4 py-2 text-xs">
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex gap-1 border-b border-white/10 px-6 pt-3 print:hidden">
        {tabs.map((t) => (
          <button
            key={t.id}
            disabled={!t.enabled}
            onClick={() => setSubTab(t.id)}
            className={`rounded-t-lg px-4 py-2.5 text-sm font-medium transition ${
              subTab === t.id
                ? "border border-b-0 border-gold/30 bg-white/[0.05] text-cream"
                : t.enabled
                ? "text-cream/45 hover:text-cream/70"
                : "text-cream/15 cursor-not-allowed"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-h-[64vh] overflow-y-auto p-6 print:max-h-none print:overflow-visible">
        {subTab === "quotation" && (
          <DocumentForm
            draft={draft} setField={setField} items={items} setItem={setItem}
            addRow={addRow} removeRow={removeRow} totals={totals}
            readOnly={false} title="QUOTATION" docRef={transaction.ref}
          />
        )}
        {subTab === "invoice" && (
          <DocumentForm
            draft={draft} setField={setField} items={items} setItem={setItem}
            addRow={addRow} removeRow={removeRow} totals={totals}
            readOnly title="INVOICE" docRef={transaction.ref?.replace("-Q-", "-INV-")}
          />
        )}
        {subTab === "delivery" && (
          <DeliveryNoteForm
            draft={draft} setField={setField} items={items} setItem={setItem}
            transactionRef={transaction.ref}
          />
        )}
        {subTab === "payments" && (
          <PaymentsTab
            transaction={transaction} adminKey={adminKey} onRefresh={onRefresh}
            total={totals.total} balanceDue={balanceDue} payments={payments}
          />
        )}
      </div>

      {(subTab === "quotation" || subTab === "delivery") ? (
        <div className="flex justify-end border-t border-white/10 px-6 py-4 print:hidden">
          <button onClick={save} disabled={saving} className="btn-gold px-6 py-2.5 text-sm">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Quotation / Invoice document — editable or read-only
// ═══════════════════════════════════════════════════════════════════
function DocumentForm({
  draft, setField, items, setItem, addRow, removeRow, totals, readOnly, title, docRef,
}: any) {
  return (
    <div>
      {/* Letterhead */}
      <div className="rounded-t-xl border border-b-0 border-white/10 bg-navy-900 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="font-display text-xl font-bold text-cream">SAWANGA</div>
            <div className="text-xs font-medium uppercase tracking-widest text-gold">Investment Limited</div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-bold gold-text">{title}</div>
            <div className="font-mono text-xs text-cream/50">{docRef}</div>
          </div>
        </div>
      </div>
      <div className="border border-t-0 border-white/10 bg-gold/[0.04] px-6 py-2 text-xs text-cream/50">
        Kitengela Plaza, Unit 1 · P.O. Box 6866-00200, Nairobi · 0723 005 719 · info@sawangainvestments.com
      </div>

      {/* Client / quote details */}
      <div className="grid gap-4 border border-t-0 border-white/10 p-6 sm:grid-cols-2">
        <fieldset className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Client Details</p>
          <Field label="Client name" value={draft.client_name} onChange={(v: string) => setField("client_name", v)} readOnly={readOnly} />
          <Field label="Company" value={draft.client_company} onChange={(v: string) => setField("client_company", v)} readOnly={readOnly} />
          <Field label="Address" value={draft.client_address} onChange={(v: string) => setField("client_address", v)} readOnly={readOnly} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone" value={draft.client_phone} onChange={(v: string) => setField("client_phone", v)} readOnly={readOnly} />
            <Field label="Email" value={draft.client_email} onChange={(v: string) => setField("client_email", v)} readOnly={readOnly} />
          </div>
          <Field label="Project" value={draft.project_name} onChange={(v: string) => setField("project_name", v)} readOnly={readOnly} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="KRA PIN" value={draft.kra_pin} onChange={(v: string) => setField("kra_pin", v)} readOnly={readOnly} />
            <Field label="VAT No." value={draft.vat_no} onChange={(v: string) => setField("vat_no", v)} readOnly={readOnly} />
          </div>
        </fieldset>
        <fieldset className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold">Quote Details</p>
          <Field label="Ref" value={docRef} readOnly />
          <Field label="Date" type="date" value={draft.quote_date} onChange={(v: string) => setField("quote_date", v)} readOnly={readOnly} />
          <Field label="Valid (days)" type="number" value={draft.valid_days} onChange={(v: string) => setField("valid_days", Number(v))} readOnly={readOnly} />
          <div>
            <label className={labelCls}>Prepared by</label>
            <select style={{ colorScheme: "dark" }} disabled={readOnly} className={inputCls} value={draft.account_manager || ""} onChange={(e) => setField("account_manager", e.target.value)}>
              <option value="">—</option>
              {ACCOUNT_MANAGERS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="VAT rate %" type="number" value={draft.vat_rate} onChange={(v: string) => setField("vat_rate", Number(v))} readOnly={readOnly} />
            <Field label="Delivery (KES)" type="number" value={draft.delivery_fee} onChange={(v: string) => setField("delivery_fee", Number(v))} readOnly={readOnly} />
          </div>
          <div>
            <label className={labelCls}>VAT treatment</label>
            <div className="flex gap-2">
              {["exclusive", "inclusive"].map((v) => (
                <button
                  key={v} type="button" disabled={readOnly}
                  onClick={() => setField("vat_treatment", v)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition disabled:opacity-50 ${
                    draft.vat_treatment === v ? "border-gold bg-gold/15 text-gold" : "border-white/10 text-cream/60"
                  }`}
                >
                  VAT {v}
                </button>
              ))}
            </div>
          </div>
        </fieldset>
      </div>

      {/* Items table */}
      <div className="overflow-x-auto border border-t-0 border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-navy-900 text-xs uppercase tracking-wide text-cream/50">
            <tr>
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3">Spec/Notes</th>
              <th className="px-3 py-3 text-right">Qty</th>
              <th className="px-3 py-3">Unit</th>
              <th className="px-3 py-3 text-right">Unit price (ex VAT)</th>
              <th className="px-3 py-3 text-right">Disc %</th>
              <th className="px-3 py-3 text-right">Line total</th>
              {!readOnly && <th className="px-2 py-3" />}
            </tr>
          </thead>
          <tbody>
            {items.map((it: TransactionItem, i: number) => {
              const gross = (it.qty || 0) * (it.unit_price || 0);
              const disc = gross * ((it.discount_pct || 0) / 100);
              const line = gross - disc;
              return (
                <tr key={i} className="border-t border-white/8">
                  <td className="px-3 py-2 text-cream/50">{i + 1}</td>
                  <td className="px-3 py-2">
                    <input disabled={readOnly} className={inputCls} value={it.description}
                      onChange={(e) => setItem(i, { description: e.target.value })} placeholder="Item description" />
                  </td>
                  <td className="px-3 py-2">
                    <input disabled={readOnly} className={inputCls} value={it.spec_notes || ""}
                      onChange={(e) => setItem(i, { spec_notes: e.target.value })} placeholder="e.g. White, Interior" />
                  </td>
                  <td className="px-3 py-2">
                    <input disabled={readOnly} type="number" className={`${inputCls} text-right`} value={it.qty}
                      onChange={(e) => setItem(i, { qty: Number(e.target.value) })} />
                  </td>
                  <td className="px-3 py-2">
                    <select style={{ colorScheme: "dark" }} disabled={readOnly} className={inputCls} value={it.unit}
                      onChange={(e) => setItem(i, { unit: e.target.value })}>
                      {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input disabled={readOnly} type="number" className={`${inputCls} text-right`} value={it.unit_price}
                      onChange={(e) => setItem(i, { unit_price: Number(e.target.value) })} />
                  </td>
                  <td className="px-3 py-2">
                    <input disabled={readOnly} type="number" className={`${inputCls} text-right`} value={it.discount_pct}
                      onChange={(e) => setItem(i, { discount_pct: Number(e.target.value) })} />
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-cream">{KES(line)}</td>
                  {!readOnly && (
                    <td className="px-2 py-2 text-center">
                      <button onClick={() => removeRow(i)} className="text-red-400/60 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!readOnly && (
          <button onClick={addRow} className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-sm font-medium text-gold hover:bg-white/[0.03]">
            <Plus className="h-4 w-4" /> Add row
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="flex justify-end border border-t-0 border-white/10 p-6">
        <div className="w-full max-w-xs space-y-2 text-sm">
          <Row label="Subtotal (ex VAT)" value={KES(totals.subtotal)} />
          <Row label={`VAT @ ${draft.vat_rate || 16}%`} value={KES(totals.vat_amount)} />
          <Row label="Delivery" value={KES(draft.delivery_fee || 0)} />
          <div className="border-t border-white/10 pt-2">
            <Row label="Total" value={KES(totals.total)} bold />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, readOnly, type = "text" }: any) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type={type}
        disabled={readOnly}
        className={inputCls}
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

function Row({ label, value, bold }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-cream/55">{label}</span>
      <span className={bold ? "font-display text-lg font-semibold gold-text" : "text-cream"}>{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Delivery Note tab
// ═══════════════════════════════════════════════════════════════════
function DeliveryNoteForm({ draft, setField, items, setItem, transactionRef }: any) {
  return (
    <div className="rounded-xl border border-white/10">
      <div className="grid gap-4 border-b border-white/10 p-6 sm:grid-cols-3">
        <Field label="Dispatched by" value={draft.dispatched_by} onChange={(v: string) => setField("dispatched_by", v)} />
        <Field label="Driver name" value={draft.driver_name} onChange={(v: string) => setField("driver_name", v)} />
        <Field label="Vehicle" value={draft.vehicle} onChange={(v: string) => setField("vehicle", v)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-navy-900 text-xs uppercase tracking-wide text-cream/50">
            <tr>
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-3">Description</th>
              <th className="px-3 py-3 text-right">Qty ordered</th>
              <th className="px-3 py-3 text-right">Qty delivered</th>
              <th className="px-3 py-3">Condition</th>
              <th className="px-3 py-3 text-center">Received</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it: TransactionItem, i: number) => (
              <tr key={i} className="border-t border-white/8">
                <td className="px-3 py-2 text-cream/50">{i + 1}</td>
                <td className="px-3 py-2 text-cream/85">
                  {it.description || "—"}
                  {it.spec_notes && <div className="text-xs text-cream/40">{it.spec_notes}</div>}
                </td>
                <td className="px-3 py-2 text-right text-cream/70">{it.qty}</td>
                <td className="px-3 py-2">
                  <input type="number" className={`${inputCls} text-right`} value={it.qty_delivered ?? ""}
                    onChange={(e) => setItem(i, { qty_delivered: Number(e.target.value) })} placeholder={String(it.qty)} />
                </td>
                <td className="px-3 py-2">
                  <select style={{ colorScheme: "dark" }} className={inputCls} value={it.condition || ""} onChange={(e) => setItem(i, { condition: e.target.value })}>
                    <option value="">—</option>
                    <option value="Good">Good</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Short">Short</option>
                  </select>
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="checkbox" checked={!!it.received}
                    onChange={(e) => setItem(i, { received: e.target.checked })}
                    className="h-4 w-4 accent-gold" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="m-6 rounded-lg border border-gold/20 bg-gold/[0.05] px-4 py-3 text-xs text-cream/60">
        <strong className="text-gold">Important:</strong> Please inspect all goods at time of delivery. Any
        shortages, damages or discrepancies must be noted before signing. SAWANGA Investment Limited will not
        be liable for claims raised after goods are accepted without notation.
      </div>
      <div className="grid gap-6 border-t border-white/10 p-6 sm:grid-cols-3">
        <SignBlock title="Dispatched by (Staff)" sub="SAWANGA Investment Limited" />
        <SignBlock title="Delivered by (Driver)" sub={draft.vehicle ? `Vehicle: ${draft.vehicle}` : "Vehicle: —"} />
        <div>
          <label className={labelCls}>Received by (Client / site rep)</label>
          <input className={inputCls} value={draft.received_by || ""} onChange={(e) => setField("received_by", e.target.value)} placeholder="Name & date" />
        </div>
      </div>
    </div>
  );
}

function SignBlock({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <div className="mb-8 border-b border-white/20" />
      <p className="text-sm font-medium text-cream/80">{title}</p>
      <p className="text-xs text-cream/40">{sub}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Payments tab
// ═══════════════════════════════════════════════════════════════════
function PaymentsTab({ transaction, adminKey, onRefresh, total, balanceDue, payments }: any) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function record() {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    setSaving(true);
    const res = await fetch(`/api/admin/transactions/${transaction.id}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminKey, amount: amt, method, note }),
    });
    setSaving(false);
    if (res.ok) {
      setAmount(""); setNote("");
      await onRefresh();
    } else {
      alert("Could not record payment.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total due" value={KES(total)} />
        <SummaryCard label="Paid to date" value={KES(transaction.amount_paid || 0)} gold />
        <SummaryCard label="Balance due" value={KES(balanceDue)} highlight={balanceDue > 0} />
      </div>

      <div className="card-luxe p-5">
        <p className="mb-3 text-sm font-semibold text-cream">Record a payment</p>
        <div className="grid gap-3 sm:grid-cols-4">
          <input type="number" placeholder="Amount (KES)" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} />
          <select style={{ colorScheme: "dark" }} value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
            {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m === "mpesa" ? "M-Pesa" : m}</option>)}
          </select>
          <input placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} className={`${inputCls} sm:col-span-1`} />
          <button onClick={record} disabled={saving} className="btn-gold justify-center text-xs">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Wallet className="h-3.5 w-3.5" /> Record</>}
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-cream/50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Note</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-cream/40">No payments recorded yet.</td></tr>
            )}
            {payments.map((p: any) => (
              <tr key={p.id} className="border-t border-white/8">
                <td className="px-4 py-3 text-cream/60">{new Date(p.created_at).toLocaleDateString("en-KE")}</td>
                <td className="px-4 py-3 capitalize text-cream/70">{p.method === "mpesa" ? "M-Pesa" : p.method}</td>
                <td className="px-4 py-3 text-cream/45">{p.note || "—"}</td>
                <td className="px-4 py-3 text-right font-semibold text-emerald-400">
                  <CheckCircle2 className="mr-1 inline h-3.5 w-3.5" /> {KES(p.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, gold, highlight }: any) {
  return (
    <div className="card-luxe p-5">
      <p className="text-xs uppercase tracking-wide text-cream/45">{label}</p>
      <p className={`mt-2 font-display text-2xl font-semibold ${gold ? "gold-text" : highlight ? "text-red-400" : "text-cream"}`}>
        {value}
      </p>
    </div>
  );
}
