"use state";

import { db } from "@/db";
import { createSession, decrypt } from "@/lib/session";
import { SessionPayload, SessionUser } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = (await decrypt(token)) as SessionPayload;
  const existingUser = await db.user.findUnique({
    where: { membershipId: user.membershipId! },
  });
  const safeUser = existingUser as SessionUser;
  await createSession(safeUser);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user: safeUser }, { status: 200 });
}
