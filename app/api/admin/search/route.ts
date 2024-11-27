import { db } from "@/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const membershipId = searchParams.get("membershipId");

    // Validate at least one search parameter
    if (!name && !email && !membershipId) {
      return NextResponse.json(
        { error: "At least one search parameter is required" },
        { status: 400 },
      );
    }

    // Build search conditions
    const where: Prisma.UserWhereInput = {
      OR: [
        name ? { name: { contains: name, mode: "insensitive" } } : {},
        email ? { email: { equals: email } } : {},
        membershipId ? { membershipId: parseInt(membershipId) } : {},
      ],
    };

    // Search users
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        membershipId: true,
        name: true,
        email: true,
        userStatus: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 },
    );
  }
}
