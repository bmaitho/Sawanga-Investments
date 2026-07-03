import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { computeTotals, amountPaid, deriveStatus, type TransactionItem } from "@/lib/transactions";

function checkAuth(key: string | null) {
  return key === (process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024");
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  if (!checkAuth(searchParams.get("adminKey"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, transaction_items(*), transaction_payments(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ transaction: data });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!checkAuth(body.adminKey)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Fields that are safe to patch directly onto the transaction row.
    const fieldKeys = [
      "stage", "client_name", "client_company", "client_address", "client_phone",
      "client_email", "project_name", "kra_pin", "vat_no", "quote_date", "valid_days",
      "account_manager", "vat_rate", "vat_treatment", "delivery_fee", "notes",
      "dispatched_by", "driver_name", "vehicle", "delivered_at", "received_by", "status",
    ];
    const patch: Record<string, any> = {};
    for (const k of fieldKeys) {
      if (k in body) patch[k] = body[k];
    }

    // Replace line items wholesale if provided (simplest consistent approach —
    // the editor always sends the full current list).
    if (Array.isArray(body.items)) {
      const { error: delErr } = await supabase
        .from("transaction_items")
        .delete()
        .eq("transaction_id", id);
      if (delErr) {
        return NextResponse.json({ error: delErr.message }, { status: 500 });
      }
      if (body.items.length > 0) {
        const rows = (body.items as TransactionItem[]).map((it, i) => ({
          transaction_id: id,
          position: i,
          description: it.description || "",
          spec_notes: it.spec_notes || null,
          qty: it.qty || 0,
          unit: it.unit || "Pcs",
          unit_price: it.unit_price || 0,
          discount_pct: it.discount_pct || 0,
          qty_delivered: it.qty_delivered ?? null,
          condition: it.condition || null,
          received: !!it.received,
        }));
        const { error: insErr } = await supabase.from("transaction_items").insert(rows);
        if (insErr) {
          return NextResponse.json({ error: insErr.message }, { status: 500 });
        }
      }
    }

    // Recompute cached totals from the (possibly just-updated) items + payments.
    const { data: items } = await supabase
      .from("transaction_items")
      .select("*")
      .eq("transaction_id", id);
    const { data: payments } = await supabase
      .from("transaction_payments")
      .select("*")
      .eq("transaction_id", id);

    const vatRate = patch.vat_rate ?? undefined;
    const deliveryFee = patch.delivery_fee ?? undefined;

    // Need current row for vat_rate/delivery_fee if not part of this patch
    const { data: current } = await supabase
      .from("transactions")
      .select("vat_rate, delivery_fee")
      .eq("id", id)
      .single();

    const effectiveVat = vatRate ?? current?.vat_rate ?? 16;
    const effectiveDelivery = deliveryFee ?? current?.delivery_fee ?? 0;

    const totals = computeTotals(items || [], effectiveVat, effectiveDelivery);
    const paid = amountPaid(payments || []);

    patch.subtotal = totals.subtotal;
    patch.vat_amount = totals.vat_amount;
    patch.total = totals.total;
    patch.amount_paid = paid;
    if (!("status" in body)) {
      patch.status = deriveStatus(totals.total, paid);
    }

    const { data: updated, error: updErr } = await supabase
      .from("transactions")
      .update(patch)
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  if (!checkAuth(searchParams.get("adminKey"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createServiceClient();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
