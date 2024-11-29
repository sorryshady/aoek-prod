import { NextRequest, NextResponse } from "next/server";

import { UserStatus } from "@prisma/client";
import { db } from "@/db";
import { SessionPayload } from "@/types";
import { decrypt, getToken } from "@/lib/session";

// Create an obituary
export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { user } = (await decrypt(token)) as SessionPayload;
    if (!user || user.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { membershipId, additionalNote } = body;

    // Validate input
    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 },
      );
    }

    // Check if user exists and is not already marked as expired
    const existingUser = await db.user.findUnique({
      where: { membershipId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing obituary
    const existingObituary = await db.obituary.findFirst({
      where: { membershipId },
    });

    if (existingObituary) {
      return NextResponse.json(
        { error: "Obituary already exists for this user" },
        { status: 400 },
      );
    }

    // Create obituary and update user status in a transaction
    const obituary = await db.$transaction(async (tx) => {
      // Update user status
      await tx.user.update({
        where: { membershipId },
        data: { userStatus: UserStatus.EXPIRED },
      });

      // Create obituary
      return await tx.obituary.create({
        data: {
          membershipId,
          additionalNote,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    });

    return NextResponse.json(obituary, { status: 201 });
  } catch (error) {
    console.error("Obituary creation error:", error);
    return NextResponse.json(
      { error: "Failed to create obituary" },
      { status: 500 },
    );
  }
}

// Get obituaries (for admin or updates page)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeExpired = searchParams.get("includeExpired") === "true";

    const whereCondition = includeExpired
      ? {}
      : { expiryDate: { gt: new Date() } };

    const obituaries = await db.obituary.findMany({
      where: whereCondition,
      include: { user: true },
      orderBy: { dateRecorded: "desc" },
    });

    return NextResponse.json(obituaries);
  } catch (error) {
    console.error("Fetching obituaries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch obituaries" },
      { status: 500 },
    );
  }
}
