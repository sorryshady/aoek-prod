"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("session")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Not logged in. Cannot log out" },
      { status: 401 },
    );
  }
  (await cookies()).delete("session");
  return NextResponse.json({ success: "Successfully logged out" });
}
