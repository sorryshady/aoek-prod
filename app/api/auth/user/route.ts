/* eslint-disable @typescript-eslint/no-unused-vars */
"use state";

import { db } from "@/db";
import { createSession, decrypt, getToken } from "@/lib/session";
import { excludeFields } from "@/lib/utils";
import { SessionPayload, SessionUser } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = await getToken(request);
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
    const token = await getToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { user } = (await decrypt(token)) as SessionPayload;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const payload = await request.json();
    const { membershipId } = payload;
    if (user.membershipId !== membershipId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
