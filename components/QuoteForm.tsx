"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Loader2, ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { CATALOG, CATALOG_CATEGORIES } from "@/lib/data";

const CUSTOMER_TYPES = [
  { v: "developer", l: "Developer" },
  { v: "contractor", l: "Contractor" },
  { v: "institution", l: "Institution" },
  { v: "homeowner", l: "Homeowner" },
];

const BUDGETS = ["Under KES 100k", "KES 100k – 500k", "KES 500k – 2M", "Over KES 2M", "Not sure yet"];

const KES = (n: number) =>
  "KES " + Number(n || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 });

// Same dark-select fix used across the site — colorScheme alone isn't
// reliably honored by every browser's native option popover, so each
// <option> also gets an explicit dark background/text style.
const selectDarkStyle = { colorScheme: "dark" as const };
const optionDarkStyle = { backgroundColor: "#0d1f4a", color: "#f3f0e8" };

type OrderLine = {
  key: string;
  itemId: string;
  name: string;
  brand: string;
  unitLabel: string;
  unitPrice: number;
  qty: number;
  note?: string;
};

function calcSubtotal(lines: OrderLine[]) {
  return lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0);
}

export default function QuoteForm() {
  const params = useSearchParams();
  const preType = params.get("type");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    customer_type: preType && CUSTOMER_TYPES.some((c) => c.v === preType) ? preType : "homeowner",
    company: "",
    project_type: "",
    location: "",
    budget_range: "",
    message: "",
    referral_code: params.get("ref") || "",
  });
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const subtotal = calcSubtotal(lines);
  const hasItems = lines.length > 0;

  function addLine(line: OrderLine) {
    setLines((prev) => [...prev, line]);
  }
  function updateQty(key: string, qty: number) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: Math.max(1, qty) } : l)));
  }
  function updateNote(key: string, note: string) {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, note } : l)));
  }
  function removeLine(key: string) {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }

  async function submit() {
    setErr("");
    if (!form.full_name || !form.email || !form.phone) {
      setErr("Please fill in your name, email and phone.");
      return;
    }
    if (!hasItems) {
      setErr("Add at least one product to your request below.");
      return;
    }
    setStatus("loading");

    // Same "Name (Brand, Unit) xQty (KES total) [Note: ...]" format used by
    // the painter portal's referral order builder, joined with " ~ " so the
    // admin dashboard can parse it into a structured list either way.
    const productLines = lines.map((l) => {
      const base = `${l.name} (${l.brand}, ${l.unitLabel}) x${l.qty} (${KES(l.qty * l.unitPrice)})`;
      return l.note ? `${base} [Note: ${l.note}]` : base;
    });

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          products: productLines,
          budget_range: form.budget_range || (subtotal > 0 ? `Est. ${KES(subtotal)}` : ""),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setStatus("done");
    } catch (e: any) {
      setErr(e.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card-luxe flex flex-col items-center p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="mt-6 font-display text-2xl font-semibold text-cream">
          Request received
        </h3>
        <p className="mt-3 max-w-md text-cream/65">
          Thank you. Our team will review your project and get back to you with a tailored
          quotation shortly. A confirmation has been sent to your email.
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
          <label className={label}>Phone *</label>
          <input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="07xx xxx xxx" />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input className={input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
        </div>
        <div>
          <label className={label}>Company (optional)</label>
          <input className={input} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company / firm" />
        </div>
      </div>

      <div className="mt-6">
        <label className={label}>I am a…</label>
        <div className="flex flex-wrap gap-3">
          {CUSTOMER_TYPES.map((c) => (
            <button
              key={c.v}
              type="button"
              onClick={() => set("customer_type", c.v)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                form.customer_type === c.v
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/10 text-cream/70 hover:border-gold/40"
              }`}
            >
              {c.l}
            </button>
          ))}
        </div>
      </div>

      {/* Order builder — same Category > Product > Brand > Measurement
          picker as the painter portal referral flow, so a client (or a
          painter quoting on their behalf) gets real, current prices per
          item instead of a vague product-category checklist. */}
      <div className="mt-6">
        <label className={label}>What do you need?</label>
        <p className="mb-3 -mt-1 text-xs text-cream/45">
          Pick items and quantities below — prices update automatically from our current price list.
        </p>
        <QuoteProductPicker onAdd={addLine} />

        <div className="mt-4">
          {lines.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-cream/40">
              <ShoppingCart className="h-4 w-4" /> No items added yet — use the picker above.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <div className="min-w-[520px]">
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
                    <div key={l.key} className="border-t border-white/10 bg-gold/[0.04] px-4 py-3">
                      <div className="grid grid-cols-12 items-center gap-2">
                        <div className="col-span-5">
                          <div className="text-sm font-medium text-cream">{l.name}</div>
                          <div className="text-xs text-cream/45">{l.brand} · {l.unitLabel}</div>
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
                          <button type="button" onClick={() => removeLine(l.key)} title="Remove item" className="text-red-400/60 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <input
                        placeholder="Add a note (optional) — e.g. colour, floor number"
                        value={l.note || ""}
                        onChange={(e) => updateNote(l.key, e.target.value)}
                        className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-cream placeholder-cream/30 outline-none transition focus:border-gold/60"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {hasItems && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-gold/30 bg-gold/[0.06] p-5">
            <span className="text-sm text-cream/60">Estimated subtotal</span>
            <span className="font-display text-xl font-semibold gold-text">{KES(subtotal)}</span>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label}>Project type</label>
          <input className={input} value={form.project_type} onChange={(e) => set("project_type", e.target.value)} placeholder="e.g. Apartment block, home renovation" />
        </div>
        <div>
          <label className={label}>Location</label>
          <input className={input} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Kitengela, Nairobi" />
        </div>
      </div>

      <div className="mt-6">
        <label className={label}>Estimated budget (optional)</label>
        <p className="mb-3 -mt-1 text-xs text-cream/45">
          Only needed if it differs from the subtotal above — e.g. if you're still deciding on quantities.
        </p>
        <div className="flex flex-wrap gap-3">
          {BUDGETS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => set("budget_range", b)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                form.budget_range === b
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-white/10 text-cream/70 hover:border-gold/40"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className={label}>Project details</label>
        <textarea className={`${input} min-h-28 resize-y`} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Timelines, delivery constraints, or anything else specific…" />
      </div>

      {form.referral_code && (
        <p className="mt-4 text-sm text-gold/80">Referral code applied: <strong>{form.referral_code}</strong></p>
      )}

      {err && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{err}</p>}

      <button onClick={submit} disabled={status === "loading"} className="btn-gold group mt-8 w-full sm:w-auto">
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Submit Quote Request
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
}

// -- Category > product > brand > unit picker, same pattern used by the
//    painter portal referral flow and the admin transaction suite --------
function QuoteProductPicker({ onAdd }: { onAdd: (line: OrderLine) => void }) {
  const [category, setCategory] = useState(CATALOG_CATEGORIES[0]);
  const productsInCategory = CATALOG.filter((c) => c.category === category);
  const [productId, setProductId] = useState(productsInCategory[0]?.id || "");
  const product = CATALOG.find((c) => c.id === productId) || productsInCategory[0];
  const [brand, setBrand] = useState(product?.brands[0] || "");
  const [unitLabel, setUnitLabel] = useState(product?.units[0]?.label || "");
  const [qty, setQty] = useState(1);

  const unitsForBrand = (product?.units || []).filter((u) => u.prices[brand] !== undefined);

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

  const unit = unitsForBrand.find((u) => u.label === unitLabel) || unitsForBrand[0];
  const unitPrice = unit ? unit.prices[brand] : undefined;

  function handleAdd() {
    if (!product || !unit || unitPrice === undefined) return;
    onAdd({
      key: `${product.id}-${brand}-${unit.label}-${Date.now()}`,
      itemId: product.id,
      name: product.name,
      brand,
      unitLabel: unit.label,
      unitPrice,
      qty: Math.max(1, qty),
    });
    setQty(1);
  }

  const selectCls =
    "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-cream outline-none transition focus:border-gold/60";

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Category</label>
          <select className={selectCls} style={selectDarkStyle} value={category} onChange={(e) => onCategoryChange(e.target.value)}>
            {CATALOG_CATEGORIES.map((c) => <option key={c} value={c} style={optionDarkStyle}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Product</label>
          <select className={selectCls} style={selectDarkStyle} value={productId} onChange={(e) => onProductChange(e.target.value)}>
            {productsInCategory.map((p) => <option key={p.id} value={p.id} style={optionDarkStyle}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Brand</label>
          <select className={selectCls} style={selectDarkStyle} value={brand} onChange={(e) => setBrand(e.target.value)}>
            {product?.brands.map((b) => <option key={b} value={b} style={optionDarkStyle}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Measurement</label>
          <select className={selectCls} style={selectDarkStyle} value={unit?.label || ""} onChange={(e) => setUnitLabel(e.target.value)}>
            {unitsForBrand.map((u) => (
              <option key={u.label} value={u.label} style={optionDarkStyle}>{u.label} — {KES(u.prices[brand])}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 sm:grid sm:grid-cols-[1fr_auto] sm:gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-cream/45">Qty</label>
            <input
              type="number" min={1} value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className={selectCls}
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!unit || unitPrice === undefined}
            className="mt-2 w-full rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-gold/90 disabled:opacity-40 sm:mt-0 sm:w-auto sm:self-end"
          >
            + Add to request
          </button>
        </div>
      </div>
    </div>
  );
}
