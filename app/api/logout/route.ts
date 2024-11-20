"use server";

import { deleteSession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = (await cookies()).get("session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not logged in. Cannot log out" }, { status: 401 });
  }
  (await cookies()).delete("session");
  return NextResponse.json({ message: "Successfully logged out" });
}
