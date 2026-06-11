import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { id, painterId, amount, adminKey } = await req.json();
    if (adminKey !== (process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const supabase = createServiceClient();

    // Mark redemption as paid
    const { error: redErr } = await supabase
      .from("redemptions")
      .update({ status: "paid" })
      .eq("id", id);
    if (redErr) return NextResponse.json({ error: redErr.message }, { status: 500 });

    // Deduct from painter balance
    const { data: painter } = await supabase
      .from("painters")
      .select("reward_points")
      .eq("id", painterId)
      .single();

    const newBalance = Math.max(0, Number(painter?.reward_points || 0) - Number(amount));
    await supabase
      .from("painters")
      .update({ reward_points: newBalance })
      .eq("id", painterId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
