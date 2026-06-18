import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "sawanga-admin-2024";
const COOKIE_NAME = "sawanga_admin_session";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (password !== ADMIN_KEY) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, ADMIN_KEY, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
