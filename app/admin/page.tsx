import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024";

  if (key !== ADMIN_KEY) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy-900 p-8">
        <div className="w-full max-w-sm rounded-2xl border border-gold/20 bg-white/[0.03] p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-cream">Admin Access</h1>
          <p className="mt-2 text-sm text-cream/50">Enter the admin key to continue</p>
          <form className="mt-6">
            <input
              name="key"
              type="password"
              placeholder="Admin key"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-cream placeholder-cream/30 outline-none focus:border-gold/50"
            />
            <button
              type="submit"
              className="btn-gold mt-4 w-full justify-center"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
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

  return (
    <AdminClient
      referrals={referrals || []}
      painters={painters || []}
      redemptions={redemptions || []}
      adminKey={ADMIN_KEY}
    />
  );
}
