import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const TABLES = new Set(["quote_requests", "contact_messages"]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.adminKey !== (process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { table, id, status } = body;
    if (!TABLES.has(table) || !id || !status) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) {
      console.error("Update lead error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
