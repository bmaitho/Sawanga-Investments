import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_RATE = 0.03; // 3% of confirmed sale value

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json();
    if (!body.client_name || !body.client_phone) {
      return NextResponse.json(
        { error: "Client name and phone are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("referrals").insert({
      painter_id: user.id,
      client_name: String(body.client_name).slice(0, 120),
      client_phone: String(body.client_phone).slice(0, 40),
      project_detail: body.project_detail || null,
      est_value: body.est_value ? Number(body.est_value) : null,
      reward_rate: DEFAULT_RATE,
      status: "pending",
    });

    if (error) {
      console.error("Referral insert:", error.message);
      return NextResponse.json({ error: "Could not save referral." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
