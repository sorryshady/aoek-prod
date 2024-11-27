import { NextRequest, NextResponse } from "next/server";
import { VerificationStatus } from "@prisma/client";
import { db } from "@/db";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { SessionPayload } from "@/types";

export async function PUT(request: NextRequest) {
  try {
    const token = (await cookies()).get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { user } = (await decrypt(token)) as SessionPayload;
    if (!user || user.userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, status, adminComments } = body;

    // Validate input
    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and Status are required" },
        { status: 400 },
      );
    }

    if (
      status !== VerificationStatus.VERIFIED ||
      status !== VerificationStatus.REJECTED
    ) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    // Fetch the existing request
    const existingRequest = await db.promotionTransferRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Update request and user based on approval
    const updatedRequest = await db.$transaction(async (tx) => {
      // Update the request
      const request = await tx.promotionTransferRequest.update({
        where: { id: requestId },
        data: {
          status,
          adminComments,
          approvedAt:
            status === VerificationStatus.VERIFIED ? new Date() : undefined,
          expiryDate:
            status === VerificationStatus.VERIFIED
              ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              : undefined,
        },
      });

      // If approved, update user details
      if (status === VerificationStatus.VERIFIED) {
        await tx.user.update({
          where: { id: existingRequest.user.id },
          data: {
            designation: request.newPosition || undefined,
            workDistrict: request.newWorkDistrict || undefined,
            officeAddress: request.newOfficeAddress || undefined,
          },
        });
      }

      return request;
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Request approval error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

// Get pending requests for admin
export async function GET(request: NextRequest) {
  try {
    const requests = await db.promotionTransferRequest.findMany({
      where: { status: VerificationStatus.PENDING },
      include: { user: true },
      orderBy: { requestedAt: "asc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Fetching pending requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending requests" },
      { status: 500 },
    );
  }
}
