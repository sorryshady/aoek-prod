import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, status } = await req.json();
    const numberOfUsers = await db.user.count({
      where: { verificationStatus: "VERIFIED" },
    });
    const membershipId = numberOfUsers + 1;
    const updatedUser = await db.user.update({
      where: { email },
      data: {
        verificationStatus: status,
        membershipId: status === "VERIFIED" ? membershipId : null,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 },
    );
  }
}
