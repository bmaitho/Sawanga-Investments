"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet, Users, Clock, CheckCircle2, Copy,
  LogOut, Plus, Loader2, Share2, X, ChevronRight, Trash2, ShoppingCart,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/Logo";
import { CATALOG, CATALOG_CATEGORIES } from "@/lib/data";

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

// -- Order builder: category > product > brand > unit > qty ---------
type OrderLine = {
  key: string;
  itemId: string;
  name: string;
  brand: string;
  unitLabel: string;
  unitPrice: number;
  rate: number;
  qty: number;
};

function calcOrder(lines: OrderLine[]) {
  let subtotal = 0;
  let commission = 0;
  lines.forEach((l) => {
    const line = l.qty * l.unitPrice;
    subtotal += line;
    commission += line * l.rate;
  });
  return { subtotal, commission };
}

export default function DashboardClient({
  painter, referrals, redemptions,
}: {
  painter: any; referrals: any[]; redemptions: any[];
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
        Setting up your profile... please refresh.
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

        {/* referral code */}
        <div className="card-luxe mt-8 flex flex-col items-start justify-between gap-4 border-gold/25 p-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <Share2 className="h-6 w-6 text-gold" />
            <div>
              <p className="text-sm text-cream/60">Your referral code</p>
              <p className="font-display text-2xl font-semibold gold-text">{painter.referral_code}</p>
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
              target="_blank" rel="noopener noreferrer" className="btn-gold"
            >
              Share link
            </a>
          </div>
        </div>

        {/* stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Wallet, label: "Reward balance", value: KES(painter.reward_points), gold: true },
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
            disabled={Number(painter.reward_points) <= 0}
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
                    <th className="px-5 py-3 font-medium">Order value</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => (
                    <tr key={r.id} className="border-t border-white/10">
                      <td className="px-5 py-4">
                        <div className="font-medium text-cream/85">{r.client_name}</div>
                        <div className="text-xs text-cream/45">{r.client_phone}</div>
                      </td>
                      <td className="px-5 py-4 text-cream/60">
                        {r.sale_value > 0 ? KES(r.sale_value) : "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[r.status] || "text-cream/60 bg-white/5"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-cream">
                        {r.points_awarded > 0 ? KES(r.points_awarded) : "-"}
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

      {showRefer && (
        <ReferModal
          onClose={() => setShowRefer(false)}
          onDone={() => { setShowRefer(false); router.refresh(); }}
        />
      )}
      {showRedeem && (
        <RedeemModal
          balance={Number(painter.reward_points)}
          onClose={() => setShowRedeem(false)}
          onDone={() => { setShowRedeem(false); router.refresh(); }}
        />
      )}
    </div>
  );
}

// -- Modal shell ------------------------------------------------------
function Modal({ children, onClose, title, wide }: any) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/85 p-4 backdrop-blur-sm">
      <div className={`card-luxe relative w-full border-gold/25 bg-[#0d1f4a] p-6 md:p-8 ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}>
        <button onClick={onClose} className="absolute right-5 top-5 text-cream/50 hover:text-gold">
          <X className="h-5 w-5" />
        </button>
        <h3 className="font-display text-2xl font-semibold text-cream">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// -- Refer modal - smart order builder --------------------------------
function ReferModal({ onClose, onDone }: any) {
  const [step, setStep] = useState<1 | 2>(1);
  const [client, setClient] = useState({ name: "", phone: "", location: "" });
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const { subtotal, commission } = calcOrder(lines);
  const hasItems = lines.length > 0;

  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-cream placeholder-cream/35 outline-none transition focus:border-gold/60";

  function nextStep() {
    if (!client.name || !client.phone) {
      setErr("Client name and phone are required.");
      return;
    }
    setErr("");
    setStep(2);
  }

  function addLine(line: OrderLine) {
    setLines((prev) => [...prev, line]);
  }
  function updateQty(key: string, qty: number) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, qty) } : l)));
  }
  function removeLine(key: string) {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }

  async function submit() {
    if (!hasItems) { setErr("Add at least one product to the order."); return; }
    setErr("");
    setLoading(true);

    const detail = lines
      .map((l) => `${l.name} (${l.brand}, ${l.unitLabel}) x${l.qty} (${KES(l.qty * l.unitPrice)})`)
      .join(", ");

    const res = await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_name: client.name,
        client_phone: client.phone,
        project_detail: `Location: ${client.location || "N/A"} | ${detail}`,
        est_value: subtotal,
      }),
    });
    setLoading(false);
    if (!res.ok) { setErr((await res.json()).error || "Failed."); return; }
    onDone();
  }

  return (
    <Modal onClose={onClose} title="Refer a client" wide>
      {/* Step indicator */}
      <div className="mt-4 flex items-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${step >= s ? "bg-gold text-navy-900" : "bg-white/10 text-cream/40"}`}>
              {s}
            </div>
            <span className={`text-sm ${step >= s ? "text-cream" : "text-cream/40"}`}>
              {s === 1 ? "Client details" : "Order & commission"}
            </span>
            {s < 2 && <ChevronRight className="h-4 w-4 text-cream/30" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="mt-6 space-y-4">
          <input className={input} placeholder="Client name *" value={client.name}
            onChange={(e) => setClient({ ...client, name: e.target.value })} />
          <input className={input} placeholder="Client phone *" value={client.phone}
            onChange={(e) => setClient({ ...client, phone: e.target.value })} />
          <input className={input} placeholder="Site location / county (optional)" value={client.location}
            onChange={(e) => setClient({ ...client, location: e.target.value })} />
          {err && <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{err}</p>}
          <button onClick={nextStep} className="btn-gold w-full mt-2">
            Next - Build order <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6">
          <p className="mb-4 text-sm text-cream/55">
            Pick a category, product, brand and measurement, then add it to the order. Prices and your
            commission calculate automatically. Add as many items as your client needs.
          </p>

          <ProductPicker onAdd={addLine} />

          {/* Order lines */}
          <div className="mt-5">
            {lines.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-cream/40">
                <ShoppingCart className="h-4 w-4" /> No items added yet - use the picker above.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="grid grid-cols-12 gap-2 bg-white/[0.04] px-4 py-2 text-xs font-medium uppercase tracking-wide text-cream/50">
                  <div className="col-span-5">Item</div>
                  <div className="col-span-2 text-right">Unit price</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1" />
                </div>
                {lines.map((l) => {
                  const lineTotal = l.qty * l.unitPrice;
                  return (
                    <div key={l.key} className="grid grid-cols-12 items-center gap-2 border-t border-white/10 bg-gold/[0.04] px-4 py-3">
                      <div className="col-span-5">
                        <div className="text-sm font-medium text-cream">{l.name}</div>
                        <div className="text-xs text-cream/45">{l.brand} - {l.unitLabel}</div>
                      </div>
                      <div className="col-span-2 text-right text-sm text-cream/60">{KES(l.unitPrice)}</div>
                      <div className="col-span-2 flex justify-center">
                        <input
                          type="number" min={1} step={1} value={l.qty}
                          onChange={(e) => updateQty(l.key, parseInt(e.target.value) || 1)}
                          className="w-16 rounded-lg border border-white/15 bg-white/[0.05] px-2 py-1.5 text-center text-sm text-cream outline-none focus:border-gold/60"
                        />
                      </div>
                      <div className="col-span-2 text-right text-sm font-semibold text-cream">{KES(lineTotal)}</div>
                      <div className="col-span-1 text-right">
                        <button onClick={() => removeLine(l.key)} className="text-red-400/60 hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className={`mt-4 rounded-xl border p-5 transition ${hasItems ? "border-gold/30 bg-gold/[0.06]" : "border-white/10 bg-white/[0.02]"}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-cream/60">Order subtotal</span>
              <span className={`font-semibold ${hasItems ? "text-cream" : "text-cream/30"}`}>
                {hasItems ? KES(subtotal) : "-"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-cream/60">Your commission</span>
              <span className={`font-display text-xl font-semibold ${hasItems ? "gold-text" : "text-cream/30"}`}>
                {hasItems ? KES(commission) : "-"}
              </span>
            </div>
            {hasItems && (
              <p className="mt-2 text-xs text-cream/45">
                Commission is credited once SAWANGA confirms the order.
              </p>
            )}
          </div>

          {err && <p className="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{err}</p>}

          <div className="mt-5 flex gap-3">
            <button onClick={() => setStep(1)} className="btn-outline flex-1">
              Back
            </button>
            <button onClick={submit} disabled={loading || !hasItems} className="btn-gold flex-1 disabled:opacity-40">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit referral"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// -- Category > product > brand > unit picker -------------------------
function ProductPicker({ onAdd }: { onAdd: (line: OrderLine) => void }) {
  const [category, setCategory] = useState(CATALOG_CATEGORIES[0]);
  const productsInCategory = CATALOG.filter((c) => c.category === category);
  const [productId, setProductId] = useState(productsInCategory[0]?.id || "");
  const product = CATALOG.find((c) => c.id === productId) || productsInCategory[0];
  const [brand, setBrand] = useState(product?.brands[0] || "");
  const [unitLabel, setUnitLabel] = useState(product?.units[0]?.label || "");
  const [qty, setQty] = useState(1);

  const selectCls =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/60";

  function onCategoryChange(cat: string) {
    setCategory(cat);
    const first = CATALOG.find((c) => c.category === cat);
    setProductId(first?.id || "");
    setBrand(first?.brands[0] || "");
    setUnitLabel(first?.units[0]?.label || "");
  }
  function onProductChange(id: string) {
    setProductId(id);
    const p = CATALOG.find((c) => c.id === id);
    setBrand(p?.brands[0] || "");
    setUnitLabel(p?.units[0]?.label || "");
  }

  const unit = product?.units.find((u) => u.label === unitLabel) || product?.units[0];

  function handleAdd() {
    if (!product || !unit) return;
    onAdd({
      key: `${product.id}-${brand}-${unit.label}-${Date.now()}`,
      itemId: product.id,
      name: product.name,
      brand,
      unitLabel: unit.label,
      unitPrice: unit.price,
      rate: product.rate,
      qty: Math.max(1, qty),
    });
    setQty(1);
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Category</label>
          <select className={selectCls} value={category} onChange={(e) => onCategoryChange(e.target.value)}>
            {CATALOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Product</label>
          <select className={selectCls} value={productId} onChange={(e) => onProductChange(e.target.value)}>
            {productsInCategory.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Brand</label>
          <select className={selectCls} value={brand} onChange={(e) => setBrand(e.target.value)}>
            {product?.brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Measurement</label>
          <select className={selectCls} value={unitLabel} onChange={(e) => setUnitLabel(e.target.value)}>
            {product?.units.map((u) => <option key={u.label} value={u.label}>{u.label} - {KES(u.price)}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Qty</label>
          <div className="flex gap-2">
            <input
              type="number" min={1} step={1} value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              className={`${selectCls} text-center`}
            />
            <button onClick={handleAdd} className="flex shrink-0 items-center gap-1 rounded-lg bg-gold px-3 py-2 text-xs font-semibold text-navy-900 transition hover:bg-gold-light">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -- Redeem modal -------------------------------------------------------
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
      <p className="mt-2 text-sm text-cream/60">Available balance: <span className="font-semibold gold-text">{KES(balance)}</span></p>
      <div className="mt-5 space-y-4">
        <input className={input} placeholder="Amount (KES)" value={amount}
          onChange={(e) => setAmount(e.target.value)} />
        <div>
          <p className="mb-2 text-sm text-cream/55">Payout method</p>
          <div className="flex flex-wrap gap-3">
            {["mpesa", "bank", "credit"].map((m) => (
              <button key={m} onClick={() => setMethod(m)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition ${
                  method === m ? "border-gold bg-gold/15 text-gold" : "border-white/10 text-cream/70"
                }`}
              >
                {m === "mpesa" ? "M-Pesa" : m}
              </button>
            ))}
          </div>
        </div>
      </div>
      {err && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-300">{err}</p>}
      <button onClick={submit} disabled={loading} className="btn-gold mt-6 w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request payout"}
      </button>
    </Modal>
  );
}
