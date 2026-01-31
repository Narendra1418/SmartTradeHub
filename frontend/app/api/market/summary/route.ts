import { NextResponse } from "next/server";

export async function GET() {
  console.log("API route HIT");

  const res = await fetch("http://localhost:4000/api/market/summary");
  const data = await res.json();

  return NextResponse.json(data);
}
