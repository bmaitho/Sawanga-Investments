// Shared types + calculation helpers for the SAWANGA Transaction Suite
// (Quotation -> Invoice -> Delivery Note -> Payments)

export type TxnStage = "quote" | "invoice" | "delivery";
export type TxnStatus = "draft" | "sent" | "paid" | "partially_paid" | "overdue" | "cancelled";

export type TransactionItem = {
  id?: string;
  transaction_id?: string;
  position: number;
  description: string;
  spec_notes?: string | null;
  qty: number;
  unit: string;
  unit_price: number;
  discount_pct: number;
  qty_delivered?: number | null;
  condition?: string | null;
  received?: boolean;
};

export type TransactionPayment = {
  id?: string;
  transaction_id?: string;
  created_at?: string;
  amount: number;
  method: "mpesa" | "bank" | "cash" | "cheque" | "credit";
  note?: string | null;
  recorded_by?: string | null;
};

export type Transaction = {
  id?: string;
  created_at?: string;
  updated_at?: string;
  ref?: string;
  stage: TxnStage;

  client_name: string;
  client_company?: string | null;
  client_address?: string | null;
  client_phone?: string | null;
  client_email?: string | null;
  project_name?: string | null;
  kra_pin?: string | null;
  vat_no?: string | null;

  quote_date: string;
  valid_days: number;
  account_manager?: string | null;
  vat_rate: number;
  vat_treatment: "exclusive" | "inclusive";
  delivery_fee: number;
  notes?: string | null;

  dispatched_by?: string | null;
  driver_name?: string | null;
  vehicle?: string | null;
  delivered_at?: string | null;
  received_by?: string | null;

  subtotal?: number;
  vat_amount?: number;
  total?: number;
  amount_paid?: number;
  status: TxnStatus;

  transaction_items?: TransactionItem[];
  transaction_payments?: TransactionPayment[];
};

export const KES = (n: number) =>
  "KES " + Number(n || 0).toLocaleString("en-KE", { maximumFractionDigits: 2 });

export const ACCOUNT_MANAGERS = ["Sarah Mwangi", "James Nyamu", "Jane Rerei"];

export const UNITS = ["Tin", "Bag", "Sheet", "Pcs", "m²", "L", "Roll", "Box", "Set"];

export const PAYMENT_METHODS: TransactionPayment["method"][] = [
  "mpesa",
  "bank",
  "cash",
  "cheque",
  "credit",
];

/** Line total excluding VAT, after discount. */
export function lineTotal(item: Pick<TransactionItem, "qty" | "unit_price" | "discount_pct">) {
  const gross = (item.qty || 0) * (item.unit_price || 0);
  const disc = gross * ((item.discount_pct || 0) / 100);
  return gross - disc;
}

export function lineVat(
  item: Pick<TransactionItem, "qty" | "unit_price" | "discount_pct">,
  vatRate: number
) {
  return lineTotal(item) * (vatRate / 100);
}

export function computeTotals(items: TransactionItem[], vatRate: number, deliveryFee: number) {
  const subtotal = items.reduce((sum, it) => sum + lineTotal(it), 0);
  const vat_amount = items.reduce((sum, it) => sum + lineVat(it, vatRate), 0);
  const total = subtotal + vat_amount + (deliveryFee || 0);
  return { subtotal, vat_amount, total };
}

export function amountPaid(payments: TransactionPayment[]) {
  return payments.reduce((sum, p) => sum + (p.amount || 0), 0);
}

/** Aging bucket relative to quote_date: current / amber (15+ days) / red (30+ days). */
export function agingBucket(quoteDate: string, balanceDue: number): "current" | "amber" | "red" {
  if (balanceDue <= 0) return "current";
  const ageDays = Math.floor((Date.now() - new Date(quoteDate).getTime()) / 86400000);
  if (ageDays >= 30) return "red";
  if (ageDays >= 15) return "amber";
  return "current";
}

export function agingDays(quoteDate: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(quoteDate).getTime()) / 86400000));
}

export function deriveStatus(total: number, paid: number): TxnStatus {
  if (paid <= 0) return "sent";
  if (paid >= total) return "paid";
  return "partially_paid";
}

export function newBlankItem(position: number): TransactionItem {
  return {
    position,
    description: "",
    spec_notes: "",
    qty: 1,
    unit: "Pcs",
    unit_price: 0,
    discount_pct: 0,
  };
}
