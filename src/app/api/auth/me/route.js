import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get("board_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ user: null });
    }

    const user = await db.getUserBySession(sessionCookie);
    return NextResponse.json({ user: user || null });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

