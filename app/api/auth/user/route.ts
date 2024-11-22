/* eslint-disable @typescript-eslint/no-unused-vars */
"use state";

import { db } from "@/db";
import { createSession, decrypt } from "@/lib/session";
import { excludeFields } from "@/lib/utils";
import { SafeUser, SessionPayload, SessionUser } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token =
    (await cookies()).get("session")?.value ||
    request.headers.get("Authorization")?.split("Bearer ")[1];
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

export async function PATCH(request: NextRequest) {
  try {
    const payload = await request.json();
    const { membershipId } = payload;
    const updatedUser = await db.user.update({
      where: { membershipId },
      data: payload,
    });
    const safeUser = excludeFields(updatedUser, [
      "password",
      "createdAt",
      "updatedAt",
    ]);
    await createSession(safeUser);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
