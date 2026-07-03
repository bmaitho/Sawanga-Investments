import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

function checkAuth(key: string | null) {
  return key === (process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminKey = searchParams.get("adminKey");
  if (!checkAuth(adminKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("transactions")
    .select("*, transaction_items(*), transaction_payments(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("List transactions error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ transactions: data || [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!checkAuth(body.adminKey)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!body.client_name) {
      return NextResponse.json({ error: "Client name is required." }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: txn, error } = await supabase
      .from("transactions")
      .insert({
        client_name: body.client_name,
        client_company: body.client_company || null,
        client_address: body.client_address || null,
        client_phone: body.client_phone || null,
        client_email: body.client_email || null,
        project_name: body.project_name || null,
        kra_pin: body.kra_pin || null,
        vat_no: body.vat_no || null,
        quote_date: body.quote_date || new Date().toISOString().slice(0, 10),
        valid_days: body.valid_days ?? 30,
        account_manager: body.account_manager || null,
        vat_rate: body.vat_rate ?? 16,
        vat_treatment: body.vat_treatment || "exclusive",
        delivery_fee: body.delivery_fee ?? 0,
        stage: "quote",
        status: "draft",
      })
      .select()
      .single();

    if (error || !txn) {
      console.error("Create transaction error:", error?.message);
      return NextResponse.json({ error: error?.message || "Failed to create" }, { status: 500 });
    }

    // Seed a single blank line item so the editor has something to work with
    await supabase.from("transaction_items").insert({
      transaction_id: txn.id,
      position: 0,
      description: "",
      qty: 1,
      unit: "Pcs",
      unit_price: 0,
      discount_pct: 0,
    });

    return NextResponse.json({ ok: true, transaction: txn });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
