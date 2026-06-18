import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminKey = searchParams.get("adminKey");

  if (adminKey !== (process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const [{ data: referrals }, { data: painters }, { data: redemptions }] =
    await Promise.all([
      supabase
        .from("referrals")
        .select("*, painters(full_name, phone, email)")
        .order("created_at", { ascending: false }),
      supabase
        .from("painters")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("redemptions")
        .select("*, painters(full_name, phone, email)")
        .order("created_at", { ascending: false }),
    ]);

  return NextResponse.json({
    referrals: referrals || [],
    painters: painters || [],
    redemptions: redemptions || [],
  });
}
