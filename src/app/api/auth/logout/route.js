import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function POST(request) {
  try {
    const sessionCookie = request.cookies.get("board_session")?.value;
    if (sessionCookie) {
      await db.deleteSession(sessionCookie);
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    response.cookies.set("board_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}

