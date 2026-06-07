import { NextResponse } from "next/server";

export async function GET(request: Request) {
  console.log("API route HIT");

  // Forward credentials from client to backend
  const res = await fetch("http://localhost:4000/api/market/summary", {
    credentials: "include",
    headers: {
      cookie: request.headers.get("cookie") || ""
    }
  });
  const data = await res.json();

  return NextResponse.json(data);
}
