import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import AdminClient from "./AdminClient";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024";
const COOKIE_NAME = "sawanga_admin_session";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);

  // Not logged in — show login form
  if (session?.value !== ADMIN_KEY) {
    return <AdminLogin />;
  }

  // Logged in — fetch data and show dashboard
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

  return (
    <AdminClient
      referrals={referrals || []}
      painters={painters || []}
      redemptions={redemptions || []}
      adminKey={ADMIN_KEY}
    />
  );
}
