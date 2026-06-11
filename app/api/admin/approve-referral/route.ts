import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Commission rates per product — must match DashboardClient
const RATES: Record<string, number> = {
  paints:   0.05,
  putty:    0.05,
  tile_adh: 0.04,
  gypsum:   0.03,
  granite:  0.03,
  sanitary: 0.03,
  primer:   0.05,
  grout:    0.04,
};
const DEFAULT_RATE = 0.03;

export async function POST(req: Request) {
  try {
    const { id, adminKey } = await req.json();
    if (adminKey !== (process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Get the referral
    const { data: referral, error: fetchErr } = await supabase
      .from("referrals")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !referral) {
      console.error("Fetch referral error:", fetchErr?.message);
      return NextResponse.json({ error: "Referral not found", detail: fetchErr?.message }, { status: 404 });
    }

    // Calculate commission from sale_value using default rate
    // (detailed per-product commission would require storing line items separately)
    const commission = Math.round(Number(referral.sale_value || 0) * DEFAULT_RATE);

    // Update referral status and award points
    const { error: updateErr } = await supabase
      .from("referrals")
      .update({ status: "approved", points_awarded: commission })
      .eq("id", id);

    if (updateErr) {
      console.error("Update error:", updateErr.message);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Credit painter's reward_points
    if (commission > 0) {
      const { data: painter } = await supabase
        .from("painters")
        .select("reward_points")
        .eq("id", referral.painter_id)
        .single();

      const current = Number(painter?.reward_points || 0);
      await supabase
        .from("painters")
        .update({ reward_points: current + commission })
        .eq("id", referral.painter_id);
    }

    return NextResponse.json({ ok: true, commission });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
