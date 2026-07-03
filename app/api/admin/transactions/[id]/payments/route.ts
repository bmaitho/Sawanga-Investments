import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { computeTotals, amountPaid, deriveStatus } from "@/lib/transactions";

function checkAuth(key: string | null) {
  return key === (process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024");
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!checkAuth(body.adminKey)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const amount = Number(body.amount);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { error: insErr } = await supabase.from("transaction_payments").insert({
      transaction_id: id,
      amount,
      method: body.method || "bank",
      note: body.note || null,
      recorded_by: body.recorded_by || null,
    });
    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }

    // Recompute cached totals/status on the parent transaction.
    const [{ data: items }, { data: payments }, { data: txn }] = await Promise.all([
      supabase.from("transaction_items").select("*").eq("transaction_id", id),
      supabase.from("transaction_payments").select("*").eq("transaction_id", id),
      supabase.from("transactions").select("vat_rate, delivery_fee").eq("id", id).single(),
    ]);

    const totals = computeTotals(items || [], txn?.vat_rate ?? 16, txn?.delivery_fee ?? 0);
    const paid = amountPaid(payments || []);

    const { data: updated, error: updErr } = await supabase
      .from("transactions")
      .update({
        subtotal: totals.subtotal,
        vat_amount: totals.vat_amount,
        total: totals.total,
        amount_paid: paid,
        status: deriveStatus(totals.total, paid),
      })
      .eq("id", id)
      .select("*, transaction_items(*), transaction_payments(*)")
      .single();

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, transaction: updated });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
