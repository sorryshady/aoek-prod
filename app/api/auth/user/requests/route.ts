import { db } from "@/db";
import { decrypt, getToken } from "@/lib/session";
import { SessionPayload } from "@/types";
import {
  VerificationStatus,
  RequestType,
  District,
  Designation,
} from "@prisma/client";
import { parse } from "date-fns";
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
    const token = await getToken(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { user } = (await decrypt(token)) as SessionPayload;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { membershipId: user.membershipId! },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (existingUser.userStatus !== "WORKING") {
      return NextResponse.json(
        { error: "User is not working" },
        { status: 400 },
      );
    }
    const body = await request.json();
    const {
      requestType,
      newPosition,
      newWorkDistrict,
      newOfficeAddress,
      retirementDate,
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
      requestType !== RequestType.TRANSFER &&
      requestType !== RequestType.RETIREMENT
    ) {
      return NextResponse.json(
        { error: "Invalid Request Type" },
        { status: 400 },
      );
    }

    // check body for transfer request
    if (
      requestType === RequestType.TRANSFER &&
      (!newWorkDistrict || !newOfficeAddress)
    ) {
      return NextResponse.json(
        {
          error:
            "New work district and office address is required for transfer",
        },
        { status: 400 },
      );
    }

    // Check for equality of districts
    if (newWorkDistrict && existingUser.workDistrict === newWorkDistrict) {
      return NextResponse.json(
        { error: "Old and new work districts cannot be the same" },
        { status: 400 },
      );
    }

    // Additional validations for District
    if (newWorkDistrict && !isValidDistrict(newWorkDistrict)) {
      return NextResponse.json(
        { error: "Invalid New Work District" },
        { status: 400 },
      );
    }

    //  Check body for promotion request
    if (requestType === RequestType.PROMOTION && !newPosition) {
      return NextResponse.json(
        { error: "Positions are required for promotion" },
        { status: 400 },
      );
    }
    // Check for equality of positions
    if (newPosition && existingUser.designation === newPosition) {
      return NextResponse.json(
        { error: "Old and new designations cannot be the same" },
        { status: 400 },
      );
    }
    // Additional validations for Designation
    if (newPosition && !isValidDesignation(newPosition)) {
      return NextResponse.json(
        { error: "Invalid new designation" },
        { status: 400 },
      );
    }

    // Check body for retirement request
    if (requestType === RequestType.RETIREMENT && !retirementDate) {
      return NextResponse.json(
        { error: "Retirement date is required for retirement" },
        { status: 400 },
      );
    }

    // Check for existing pending request
    const existingPendingRequest = await db.promotionTransferRequest.findFirst({
      where: {
        membershipId: existingUser.membershipId!,
        status: VerificationStatus.PENDING,
      },
    });

    if (existingPendingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request" },
        { status: 400 },
      );
    }

    let date;
    if (retirementDate) {
      date = parse(retirementDate, "dd/MM/yyyy", new Date());
    }

    // Create the request
    const newRequest = await db.promotionTransferRequest.create({
      data: {
        membershipId: existingUser.membershipId!,
        requestType,
        oldPosition: existingUser.designation,
        newPosition,
        oldWorkDistrict: existingUser.workDistrict,
        newWorkDistrict,
        oldOfficeAddress: existingUser.officeAddress,
        newOfficeAddress,
        retirementDate: date,
        status: VerificationStatus.PENDING,
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

// update a requests visibility
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

    const { searchParams } = request.nextUrl;
    const requestId = searchParams.get("requestId");
    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID are required" },
        { status: 400 },
      );
    }
    const updatedRequest = await db.promotionTransferRequest.update({
      where: { id: requestId },
      data: { showAgain: false },
    });
    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Updating request error: ", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 },
    );
  }
}
