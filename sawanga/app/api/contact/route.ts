import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendContactEmails } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.full_name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      );
    }

    const payload = {
      full_name: String(body.full_name).slice(0, 120),
      email: String(body.email).slice(0, 160),
      phone: body.phone || null,
      subject: body.subject || null,
      message: String(body.message).slice(0, 2000),
    };

    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert(payload);
    if (error) {
      console.error("Contact insert error:", error.message);
      return NextResponse.json(
        { error: "Could not send your message. Please try again." },
        { status: 500 }
      );
    }

    try {
      await sendContactEmails(payload);
    } catch (e) {
      console.error("Contact email error:", e);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
