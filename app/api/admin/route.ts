"use server";

import { db } from "@/db";
import { decrypt } from "@/lib/session";
import { excludeFields } from "@/lib/utils";
import { SessionPayload } from "@/types";
import { Prisma, VerificationStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const userType = searchParams.get("userType");

    // Extract token from cookies and verify
    const token = (await cookies()).get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = (await decrypt(token)) as SessionPayload;
    const existingUser = await db.user.findUnique({
      where: { membershipId: user.membershipId!},
    });

    if (!user || !existingUser || existingUser.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Helper function for fetching users by verification status
    const fetchUsersByStatus = async (status: string) => {
      const users = await db.user.findMany({
        where: { verificationStatus: status as VerificationStatus },
      });
      return users.map((user) => excludeFields(user, ["password"]));
    };

    switch (userType) {
      case "verified":
        return NextResponse.json({
          verifiedUsers: await fetchUsersByStatus("VERIFIED"),
        });
      case "pending":
        return NextResponse.json({
          pendingUsers: await fetchUsersByStatus("PENDING"),
        });
      case "rejected":
        return NextResponse.json({
          rejectedUsers: await fetchUsersByStatus("REJECTED"),
        });
      default:
        return NextResponse.json({ error: "Invalid Request" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  let membershipId: string | null = null; // Define outside try block
  try {
    // Extract membershipId from query parameters
    const { searchParams } = request.nextUrl;
    membershipId = searchParams.get("membershipId");

    // Validate membershipId
    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required for deletion." },
        { status: 400 },
      );
    }

    // Attempt to delete the user
    const deletedUser = await db.user.delete({
      where: { membershipId: Number(membershipId) },
    });
    const safeDeletedUser = excludeFields(deletedUser, ["password"]);

    // If the user was deleted successfully, return a success response
    return NextResponse.json(
      {
        success: true,
        message: `User with Membership ID ${membershipId} has been deleted.`,
        safeDeletedUser,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error in DELETE handler:", error);

    // Handle case where user is not found
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        {
          error: `User with Membership ID ${membershipId || "unknown"} not found.`,
        },
        { status: 404 },
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
        membershipId: membershipId || "unknown", // Include membershipId in error details
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      membershipId,
      committeeType,
      userStatus,
      userRole,
      verificationStatus,
      positionState,
      positionDistrict,
      email,
    } = body;

    // Validate that membershipId is provided or email is present when updating verificationStatus
    if (verificationStatus === "VERIFIED" && !email) {
      return NextResponse.json(
        {
          error:
            "'email' is required to update verificationStatus to VERIFIED.",
        },
        { status: 400 },
      );
    }

    // Check if user exists by either membershipId or email
    let existingUser;
    if (membershipId) {
      existingUser = await db.user.findUnique({
        where: { membershipId: Number(membershipId) },
      });
    } else if (email) {
      existingUser = await db.user.findUnique({
        where: { email: email },
      });
    }

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Use Prisma's UserUpdateInput type to ensure type safety
    const updateData: Prisma.UserUpdateInput = {};

    // Update committeeType, userStatus, userRole, and verificationStatus
    if (committeeType !== undefined) updateData.committeeType = committeeType;
    if (userStatus !== undefined) updateData.userStatus = userStatus;
    if (userRole !== undefined) updateData.userRole = userRole;
    if (verificationStatus !== undefined)
      updateData.verificationStatus = verificationStatus;

    // If the verificationStatus is set to "VERIFIED", generate membershipId if it's not already set
    if (verificationStatus === "VERIFIED") {
      // If membershipId is already set, we don't need to update it again
      if (!existingUser.membershipId) {
        const verifiedUserCount = await db.user.count({
          where: { verificationStatus: "VERIFIED" },
        });
        const newMembershipId = verifiedUserCount + 1; // Adjust the membershipId format if needed
        updateData.membershipId = newMembershipId;
      }
    }

    // Conditional checks for positionState and positionDistrict
    if (committeeType === "STATE" && positionState !== undefined) {
      updateData.positionState = positionState;
    } else if (positionState !== undefined) {
      return NextResponse.json(
        {
          error:
            "positionState can only be updated when committeeType is STATE.",
        },
        { status: 400 },
      );
    }

    if (committeeType === "DISTRICT" && positionDistrict !== undefined) {
      updateData.positionDistrict = positionDistrict;
    } else if (positionDistrict !== undefined) {
      return NextResponse.json(
        {
          error:
            "positionDistrict can only be updated when committeeType is DISTRICT.",
        },
        { status: 400 },
      );
    }

    // If no fields to update are provided, return an error
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update." },
        { status: 400 },
      );
    }

    // Update the user in the database
    const updatedUser = await db.user.update({
      where: email ? { email: email } : { membershipId: membershipId }, // Use email if membershipId is not provided
      data: updateData,
    });
    const safeUpdatedUser = excludeFields(updatedUser, ["password"]);

    // Return the updated user object
    return NextResponse.json({
      success: true,
      message: `User updated successfully.`,
      safeUpdatedUser,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
