import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

    const body = await req.json();
    const amount = Number(body.amount);
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });
    }

    // Check balance
    const { data: painter } = await supabase
      .from("painters")
      .select("total_points")
      .eq("id", user.id)
      .single();

    if (!painter || Number(painter.total_points) < amount) {
      return NextResponse.json({ error: "Insufficient reward balance." }, { status: 400 });
    }

    const { error } = await supabase.from("redemptions").insert({
      painter_id: user.id,
      amount,
      method: body.method || "mpesa",
      status: "requested",
    });
    if (error) {
      return NextResponse.json({ error: "Could not submit request." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
