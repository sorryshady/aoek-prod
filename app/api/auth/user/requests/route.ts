import { db } from "@/db";
import { decrypt } from "@/lib/session";
import { SessionPayload } from "@/types";
import {
  RequestStatus,
  RequestType,
  District,
  Designation,
} from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Function to check if a value is a valid District
function isValidDistrict(district: any): district is District {
  return Object.values(District).includes(district);
}
function isValidDesignation(designation: any): designation is Designation {
  return Object.values(Designation).includes(designation);
}

// Create a new promotion/transfer request
export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = (await decrypt(token)) as SessionPayload;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      requestType,
      oldPosition,
      newPosition,
      oldWorkDistrict,
      newWorkDistrict,
      oldOfficeAddress,
      newOfficeAddress,
    } = body;

    // Validate input
    if (!requestType) {
      return NextResponse.json(
        { error: "Request Type is required" },
        { status: 400 },
      );
    }

    if (
      requestType !== RequestType.PROMOTION &&
      requestType !== RequestType.TRANSFER
    ) {
      return NextResponse.json(
        { error: "Invalid Request Type" },
        { status: 400 },
      );
    }
    // check body for transfer request
    if (
      requestType === RequestType.TRANSFER &&
      (!newWorkDistrict ||
        !oldWorkDistrict ||
        !newOfficeAddress ||
        !oldOfficeAddress)
    ) {
      return NextResponse.json(
        {
          error:
            "Work Districts and office addresses are required for Transfer",
        },
        { status: 400 },
      );
    }
    // Check for equality of districts
    if (
      oldWorkDistrict &&
      newWorkDistrict &&
      oldWorkDistrict === newWorkDistrict
    ) {
      return NextResponse.json(
        { error: "Old and New Work Districts cannot be the same" },
        { status: 400 },
      );
    }

    // Additional validations for District
    if (oldWorkDistrict && !isValidDistrict(oldWorkDistrict)) {
      return NextResponse.json(
        { error: "Invalid Old Work District" },
        { status: 400 },
      );
    }

    if (newWorkDistrict && !isValidDistrict(newWorkDistrict)) {
      return NextResponse.json(
        { error: "Invalid New Work District" },
        { status: 400 },
      );
    }

    //  Check body for promotion request
    if (
      requestType === RequestType.PROMOTION &&
      (!newPosition || !oldPosition)
    ) {
      return NextResponse.json(
        { error: "Positions are required for Promotion" },
        { status: 400 },
      );
    }
    // Check for equality of positions
    if (oldPosition && newPosition && oldPosition === newPosition) {
      return NextResponse.json(
        { error: "Old and New Positions cannot be the same" },
        { status: 400 },
      );
    }
    // Additional validations for Designation
    if (oldPosition && !isValidDesignation(oldPosition)) {
      return NextResponse.json(
        { error: "Invalid Old Designation" },
        { status: 400 },
      );
    }

    if (newPosition && !isValidDesignation(newPosition)) {
      return NextResponse.json(
        { error: "Invalid New Designation" },
        { status: 400 },
      );
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { membershipId: user.membershipId! },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing pending request
    const existingPendingRequest = await db.promotionTransferRequest.findFirst({
      where: {
        membershipId: user.membershipId!,
        status: RequestStatus.PENDING,
      },
    });

    if (existingPendingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request" },
        { status: 400 },
      );
    }

    // Create the request
    const newRequest = await db.promotionTransferRequest.create({
      data: {
        membershipId: user.membershipId!,
        requestType,
        oldPosition,
        newPosition,
        oldWorkDistrict,
        newWorkDistrict,
        oldOfficeAddress,
        newOfficeAddress,
        status: RequestStatus.PENDING,
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Request creation error: ", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 },
    );
  }
}

// Get user's request history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const membershipId = searchParams.get("membershipId");

    if (!membershipId) {
      return NextResponse.json(
        { error: "Membership ID is required" },
        { status: 400 },
      );
    }

    const requests = await db.promotionTransferRequest.findMany({
      where: { membershipId: parseInt(membershipId) },
      orderBy: { requestedAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Fetching requests error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 },
    );
  }
}
