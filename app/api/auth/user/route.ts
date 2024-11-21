"use state";

import { decrypt } from "@/lib/session";
import { SessionPayload } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = (await decrypt(token)) as SessionPayload;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user }, { status: 200 });
}
