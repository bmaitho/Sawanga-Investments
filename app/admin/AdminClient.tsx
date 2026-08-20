"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, XCircle, Clock, Users, Wallet,
  RefreshCw, ChevronDown, ChevronUp, BadgeCheck, LogOut,
  FileText, BarChart3, Inbox, MessageSquare,
} from "lucide-react";
import TransactionsPanel from "./TransactionsPanel";
import PaymentsTracker from "./PaymentsTracker";

const KES = (n: number) =>
  "KES " + Number(n || 0).toLocaleString("en-KE", { maximumFractionDigits: 0 });

const optionDarkStyle = { backgroundColor: "#0d1f4a", color: "#f3f0e8" };

// Opens a Gmail compose window in the browser (works regardless of the
// device's default mail-app setting, unlike mailto: links).
const gmailComposeUrl = (to: string, subject: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}`;

const statusColor: Record<string, string> = {
  new:       "text-gold bg-gold/10 border-gold/20",
  reviewing: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  quoted:    "text-sky-400 bg-sky-400/10 border-sky-400/20",
  won:       "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  lost:      "text-red-400 bg-red-400/10 border-red-400/20",
  read:      "text-sky-400 bg-sky-400/10 border-sky-400/20",
  responded: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  paid:      "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  pending:   "text-gold bg-gold/10 border-gold/20",
  requested: "text-gold bg-gold/10 border-gold/20",
  rejected:  "text-red-400 bg-red-400/10 border-red-400/20",
  processing:"text-sky-400 bg-sky-400/10 border-sky-400/20",
};

// Referral order details are stored as one flattened string (see
// DashboardClient's ReferModal), e.g.
//   "Location: Karen ~ Paints & Coatings (Crown, 20 Ltr bucket) x5 (KES 24,000) [Note: white]"
// Newer submissions separate items with " ~ "; older ones used ", " (which
// breaks if a note contains a comma). Parse best-effort into a structured
// list for display; fall back to the raw string if it doesn't match.
type ParsedOrderItem = { name: string; brand: string; unit: string; qty: string; total: string; note?: string; raw?: string };
type ParsedOrderDetail = { location: string | null; items: ParsedOrderItem[] } | null;

const ITEM_RE = /^(.+?) \((.+?),\s*(.+?)\)\s*x(\d+)\s*\((KES[\d,\s]*)\)(?:\s*\[Note:\s*(.*?)\])?$/;

function parseOrderDetail(raw: string): ParsedOrderDetail {
  if (!raw) return null;
  let location: string | null = null;
  let rest = raw;
  const locMatch = raw.match(/^Location:\s*([^|~]*)[|~]\s*([\s\S]*)$/);
  if (locMatch) {
    location = locMatch[1].trim();
    rest = locMatch[2].trim();
  }
  if (!rest) return { location, items: [] };

  const tryParse = (chunks: string[]): ParsedOrderItem[] =>
    chunks.map((c) => {
      const m = c.trim().match(ITEM_RE);
      if (!m) return { raw: c.trim() } as ParsedOrderItem;
      const [, name, brand, unit, qty, total, note] = m;
      return { name, brand, unit, qty, total, note: note || undefined };
    });

  // Prefer the newer " ~ " delimiter; only fall back to the comma-based
  // split (used by older referrals) if there's no "~" in the string at all.
  const chunks = rest.includes(" ~ ") ? rest.split(" ~ ") : rest.split(", ");
  const items = tryParse(chunks);
  return { location, items };
}

// Quote requests store each product as its own array entry (from
// QuoteProductPicker) in the same "Name (Brand, Unit) xQty (KES total)"
// format — parse each, falling back to the raw string for older
// plain-category submissions (e.g. "Paints & Coatings") that predate the
// order builder.
function parseProductLines(products: string[]): ParsedOrderItem[] {
  return (products || []).map((raw) => {
    const m = raw.trim().match(ITEM_RE);
    if (!m) return { raw: raw.trim() } as ParsedOrderItem;
    const [, name, brand, unit, qty, total, note] = m;
    return { name, brand, unit, qty, total, note: note || undefined };
  });
}

type Tab = "referrals" | "painters" | "redemptions";
type Section = "transactions" | "painter-portal" | "leads";
type TxnView = "list" | "tracker";
type LeadTab = "quotes" | "messages";

export default function AdminClient({
  referrals, painters, redemptions, transactions, quoteRequests, contactMessages, adminKey,
}: {
  referrals: any[];
  painters: any[];
  redemptions: any[];
  transactions: any[];
  quoteRequests?: any[];
  contactMessages?: any[];
  adminKey: string;
}) {
  const [section, setSection] = useState<Section>("transactions");
  const [txnView, setTxnView] = useState<TxnView>("list");
  const [tab, setTab] = useState<Tab>("referrals");
  const [leadTab, setLeadTab] = useState<LeadTab>("quotes");
  const [loading, setLoading] = useState<string | null>(null);
  const [localReferrals, setLocalReferrals] = useState(referrals);
  const [localRedemptions, setLocalRedemptions] = useState(redemptions);
  const [localTransactions, setLocalTransactions] = useState(transactions);
  const [localQuoteRequests, setLocalQuoteRequests] = useState(quoteRequests || []);
  const [localContactMessages, setLocalContactMessages] = useState(contactMessages || []);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function handleRefresh() {
    setRefreshing(true);
    const res = await fetch("/api/admin/data?adminKey=" + adminKey);
    if (res.ok) {
      const d = await res.json();
      setLocalReferrals(d.referrals);
      setLocalRedemptions(d.redemptions);
      setLocalTransactions(d.transactions || []);
      setLocalQuoteRequests(d.quoteRequests || []);
      setLocalContactMessages(d.contactMessages || []);
    }
    setRefreshing(false);
  }

  async function updateLeadStatus(table: "quote_requests" | "contact_messages", id: string, status: string) {
    setLoading(id + "-lead");
    const res = await fetch("/api/admin/update-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id, status, adminKey }),
    });
    setLoading(null);
    if (res.ok) {
      if (table === "quote_requests") {
        setLocalQuoteRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      } else {
        setLocalContactMessages((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
      }
    } else {
      alert("Failed to update status.");
    }
  }

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
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="font-display text-3xl font-semibold text-cream">
              SAWANGA <span className="gold-text">{section === "transactions" ? "Transaction Suite" : section === "leads" ? "Leads" : "Admin"}</span>
            </h1>
            <p className="mt-1 text-sm text-cream/45">
              {section === "transactions" ? "Quotations · Invoices · Delivery · Payments" : section === "leads" ? "Quote requests & contact messages from the website" : "Painter portal management"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleRefresh} className="btn-outline gap-2">
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="btn-outline gap-2 border-red-400/30 text-red-400 hover:bg-red-400/10"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>

        {/* Section switcher */}
        <div className="mt-6 inline-flex rounded-2xl border border-white/10 bg-white/[0.03] p-1 print:hidden">
          <button
            onClick={() => setSection("transactions")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              section === "transactions" ? "bg-gold text-navy-900" : "text-cream/55 hover:text-cream"
            }`}
          >
            <FileText className="h-4 w-4" /> Transaction Suite
          </button>
          <button
            onClick={() => setSection("painter-portal")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              section === "painter-portal" ? "bg-gold text-navy-900" : "text-cream/55 hover:text-cream"
            }`}
          >
            <Users className="h-4 w-4" /> Painter Portal
          </button>
          <button
            onClick={() => setSection("leads")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              section === "leads" ? "bg-gold text-navy-900" : "text-cream/55 hover:text-cream"
            }`}
          >
            <Inbox className="h-4 w-4" /> Leads
            {(localQuoteRequests.filter((q) => q.status === "new").length + localContactMessages.filter((m) => m.status === "new").length) > 0 && (
              <span className="rounded-full bg-navy-900/20 px-2 py-0.5 text-xs font-bold">
                {localQuoteRequests.filter((q) => q.status === "new").length + localContactMessages.filter((m) => m.status === "new").length}
              </span>
            )}
          </button>
        </div>

        {/* ══════════════════ TRANSACTION SUITE ══════════════════ */}
        {section === "transactions" && (
          <div className="mt-6">
            <div className="flex gap-2 border-b border-white/10 print:hidden">
              <button
                onClick={() => setTxnView("list")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  txnView === "list" ? "border-gold text-cream" : "border-transparent text-cream/45 hover:text-cream/70"
                }`}
              >
                <FileText className="h-4 w-4" /> Transactions
              </button>
              <button
                onClick={() => setTxnView("tracker")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  txnView === "tracker" ? "border-gold text-cream" : "border-transparent text-cream/45 hover:text-cream/70"
                }`}
              >
                <BarChart3 className="h-4 w-4" /> Payments Tracker
              </button>
            </div>

            {txnView === "list" ? (
              <TransactionsPanel
                transactions={localTransactions}
                adminKey={adminKey}
                onRefresh={handleRefresh}
              />
            ) : (
              <PaymentsTracker transactions={localTransactions} adminKey={adminKey} onRefresh={handleRefresh} />
            )}
          </div>
        )}

        {/* ══════════════════ LEADS (quote requests + contact messages) ══════════════════ */}
        {section === "leads" && (
          <div className="mt-6">
            <div className="flex gap-2 border-b border-white/10 print:hidden">
              <button
                onClick={() => setLeadTab("quotes")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  leadTab === "quotes" ? "border-gold text-cream" : "border-transparent text-cream/45 hover:text-cream/70"
                }`}
              >
                <FileText className="h-4 w-4" /> Quote Requests
                {localQuoteRequests.length > 0 && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-cream/60">{localQuoteRequests.length}</span>
                )}
              </button>
              <button
                onClick={() => setLeadTab("messages")}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                  leadTab === "messages" ? "border-gold text-cream" : "border-transparent text-cream/45 hover:text-cream/70"
                }`}
              >
                <MessageSquare className="h-4 w-4" /> Contact Messages
                {localContactMessages.length > 0 && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-cream/60">{localContactMessages.length}</span>
                )}
              </button>
            </div>

            {leadTab === "quotes" && (
              <div className="mt-6 space-y-3">
                {localQuoteRequests.length === 0 && (
                  <p className="card-luxe p-8 text-center text-cream/45">No quote requests yet.</p>
                )}
                {localQuoteRequests.map((q) => {
                  const isExpanded = expandedId === "quote-" + q.id;
                  return (
                    <div key={q.id} className="card-luxe overflow-hidden">
                      <div className="flex flex-wrap items-center gap-4 p-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-cream">{q.full_name}</span>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor[q.status] || "text-cream/50 bg-white/5 border-white/10"}`}>
                              {q.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-3 text-xs text-cream/45">
                            <span>{q.phone}</span>
                            <span>·</span>
                            <span>{q.email}</span>
                            <span>·</span>
                            <span className="capitalize">{q.customer_type}</span>
                            <span>·</span>
                            <span>{new Date(q.created_at).toLocaleDateString("en-KE")}</span>
                          </div>
                        </div>

                        <select
                          style={{ colorScheme: "dark" }}
                          disabled={loading === q.id + "-lead"}
                          value={q.status}
                          onChange={(e) => updateLeadStatus("quote_requests", q.id, e.target.value)}
                          className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-cream"
                        >
                          {["new", "reviewing", "quoted", "won", "lost"].map((s) => (
                            <option key={s} value={s} style={optionDarkStyle}>{s}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : "quote-" + q.id)}
                          className="text-cream/30 hover:text-cream/60"
                        >
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-white/8 bg-white/[0.02] px-5 py-4 space-y-2 text-sm">
                          {q.company && <p><span className="text-cream/40">Company:</span> <span className="text-cream/80">{q.company}</span></p>}
                          {q.project_type && <p><span className="text-cream/40">Project type:</span> <span className="text-cream/80">{q.project_type}</span></p>}
                          {q.location && <p><span className="text-cream/40">Location:</span> <span className="text-cream/80">{q.location}</span></p>}
                          {q.products?.length > 0 && (() => {
                            const parsedItems = parseProductLines(q.products);
                            const total = parsedItems.reduce((sum: number, it: ParsedOrderItem) => {
                              const n = Number(String(it.total || "").replace(/[^\d.]/g, ""));
                              return sum + (Number.isFinite(n) ? n : 0);
                            }, 0);
                            return (
                              <div>
                                <div className="flex items-center justify-between">
                                  <p className="text-cream/40">Products requested:</p>
                                  {total > 0 && <p className="text-xs font-medium text-gold">Est. total: {KES(total)}</p>}
                                </div>
                                <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
                                  {parsedItems.map((it, idx) => (
                                    <div key={idx} className={`px-4 py-2.5 ${idx > 0 ? "border-t border-white/8" : ""}`}>
                                      {it.raw ? (
                                        <p className="text-sm text-cream/70">{it.raw}</p>
                                      ) : (
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                          <div>
                                            <span className="text-sm font-medium text-cream">{it.name}</span>
                                            <span className="ml-2 text-xs text-cream/45">{it.brand} · {it.unit}</span>
                                          </div>
                                          <div className="text-right">
                                            <span className="text-sm text-cream/60">x{it.qty}</span>
                                            <span className="ml-3 text-sm font-semibold text-cream">{it.total}</span>
                                          </div>
                                        </div>
                                      )}
                                      {it.note && <p className="mt-1 text-xs italic text-gold/70">Note: {it.note}</p>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                          {q.budget_range && <p><span className="text-cream/40">Budget:</span> <span className="text-cream/80">{q.budget_range}</span></p>}
                          {q.referral_code && <p><span className="text-cream/40">Referral code:</span> <span className="text-cream/80">{q.referral_code}</span></p>}
                          {q.message && (
                            <div>
                              <p className="text-cream/40">Message:</p>
                              <p className="mt-1 text-cream/80">{q.message}</p>
                            </div>
                          )}
                          <a href={gmailComposeUrl(q.email, `Re: your quote request — SAWANGA Investment`)} target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-medium text-gold hover:underline">Reply by email →</a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {leadTab === "messages" && (
              <div className="mt-6 space-y-3">
                {localContactMessages.length === 0 && (
                  <p className="card-luxe p-8 text-center text-cream/45">No contact messages yet.</p>
                )}
                {localContactMessages.map((m) => {
                  const isExpanded = expandedId === "msg-" + m.id;
                  return (
                    <div key={m.id} className="card-luxe overflow-hidden">
                      <div className="flex flex-wrap items-center gap-4 p-5">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-cream">{m.full_name}</span>
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor[m.status] || "text-cream/50 bg-white/5 border-white/10"}`}>
                              {m.status}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-3 text-xs text-cream/45">
                            <span>{m.email}</span>
                            {m.phone && <><span>·</span><span>{m.phone}</span></>}
                            {m.subject && <><span>·</span><span>{m.subject}</span></>}
                            <span>·</span>
                            <span>{new Date(m.created_at).toLocaleDateString("en-KE")}</span>
                          </div>
                        </div>

                        <select
                          style={{ colorScheme: "dark" }}
                          disabled={loading === m.id + "-lead"}
                          value={m.status}
                          onChange={(e) => updateLeadStatus("contact_messages", m.id, e.target.value)}
                          className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-cream"
                        >
                          {["new", "read", "responded"].map((s) => (
                            <option key={s} value={s} style={optionDarkStyle}>{s}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : "msg-" + m.id)}
                          className="text-cream/30 hover:text-cream/60"
                        >
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-white/8 bg-white/[0.02] px-5 py-4 space-y-2 text-sm">
                          <p className="text-cream/80">{m.message}</p>
                          <a href={gmailComposeUrl(m.email, `Re: your message — SAWANGA Investment`)} target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-medium text-gold hover:underline">Reply by email →</a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ PAINTER PORTAL (existing) ══════════════════ */}
        {section === "painter-portal" && (
        <>
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
                  {isExpanded && r.project_detail && (() => {
                    const parsed = parseOrderDetail(r.project_detail);
                    if (!parsed || parsed.items.length === 0) {
                      return (
                        <div className="border-t border-white/8 bg-white/[0.02] px-5 py-4">
                          <p className="text-xs font-medium uppercase tracking-wide text-cream/40">Order detail</p>
                          <p className="mt-2 text-sm leading-relaxed text-cream/70">{r.project_detail}</p>
                        </div>
                      );
                    }
                    return (
                      <div className="border-t border-white/8 bg-white/[0.02] px-5 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-cream/40">Order detail</p>
                          {parsed.location && (
                            <p className="text-xs text-cream/50">
                              Site location: <span className="font-medium text-cream/75">{parsed.location}</span>
                            </p>
                          )}
                        </div>
                        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                          {parsed.items.map((it, i) => (
                            <div
                              key={i}
                              className={`px-4 py-2.5 ${i > 0 ? "border-t border-white/8" : ""}`}
                            >
                              {it.raw ? (
                                <p className="text-sm text-cream/70">{it.raw}</p>
                              ) : (
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <span className="text-sm font-medium text-cream">{it.name}</span>
                                    <span className="ml-2 text-xs text-cream/45">{it.brand} · {it.unit}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm text-cream/60">x{it.qty}</span>
                                    <span className="ml-3 text-sm font-semibold text-cream">{it.total}</span>
                                  </div>
                                </div>
                              )}
                              {it.note && (
                                <p className="mt-1 text-xs italic text-gold/70">Note: {it.note}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
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
        </>
        )}
      </div>
    </div>
  );
}
