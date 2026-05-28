import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/painter-portal/login");

  const { data: painter } = await supabase
    .from("painters")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: referrals } = await supabase
    .from("referrals")
    .select("*")
    .eq("painter_id", user.id)
    .order("created_at", { ascending: false });

  const { data: redemptions } = await supabase
    .from("redemptions")
    .select("*")
    .eq("painter_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <DashboardClient
      painter={painter}
      referrals={referrals || []}
      redemptions={redemptions || []}
    />
  );
}
