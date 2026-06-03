import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendQuoteEmails } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.full_name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Name, email and phone are required." },
        { status: 400 }
      );
    }

    const payload = {
      full_name: String(body.full_name).slice(0, 120),
      email: String(body.email).slice(0, 160),
      phone: String(body.phone).slice(0, 40),
      customer_type: body.customer_type || "homeowner",
      company: body.company || null,
      project_type: body.project_type || null,
      location: body.location || null,
      products: Array.isArray(body.products) ? body.products : [],
      budget_range: body.budget_range || null,
      message: body.message || null,
      referral_code: body.referral_code || null,
    };

    const supabase = await createClient();
    const { error } = await supabase.from("quote_requests").insert(payload);
    if (error) {
      console.error("Quote insert error:", error.message);
      return NextResponse.json(
        { error: "Could not save your request. Please try again." },
        { status: 500 }
      );
    }

    // Fire emails (non-blocking failure)
    try {
      await sendQuoteEmails(payload);
    } catch (e) {
      console.error("Quote email error:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
