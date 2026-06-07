import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Call backend logout to clear Redis session
  try {
    await fetch("http://localhost:4000/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        cookie: request.headers.get("cookie") || ""
      }
    });
  } catch (err) {
    console.error("Backend logout failed:", err);
  }

  const response = NextResponse.json({ success: true });

  // ❌ Delete cookie
  response.cookies.set("user", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}
