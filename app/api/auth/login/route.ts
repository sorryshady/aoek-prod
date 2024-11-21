"use server";

import { db } from "@/db";
import { SecurityQuestionType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { SessionUser } from "@/types";
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const email = searchParams.get("email");
    const membershipId = searchParams.get("membershipId");

    // Validate input
    if (!email && !membershipId) {
      return NextResponse.json(
        { error: "Either 'email' or 'membershipId' is required." },
        { status: 400 },
      );
    }

    if (email && membershipId) {
      return NextResponse.json(
        {
          error:
            "Please provide only one of 'email' or 'membershipId', not both.",
        },
        { status: 400 },
      );
    }

    // Determine query criteria
    const whereClause = email
      ? { email }
      : { membershipId: Number(membershipId) }; // Assuming membershipId is always present if email isn't

    // Fetch user from the database
    const existingUser = await db.user.findUnique({ where: whereClause });
    if (!existingUser) {
      const field = email ? "email" : "membershipId";
      return NextResponse.json(
        { error: `User with provided ${field} not found.` },
        { status: 404 },
      );
    }

    // Handle verification status
    switch (existingUser.verificationStatus) {
      case "PENDING":
        return NextResponse.json(
          { error: "User is not yet verified and cannot log in." },
          { status: 401 },
        );
      case "REJECTED":
        return NextResponse.json(
          { error: "Membership request has been rejected. Cannot log in." },
          { status: 401 },
        );
    }

    // Determine if this is the first login
    const firstLogin = !existingUser.password;

    // Return user details without sensitive fields
    const {
      name,
      email: userEmail,
      userRole,
      membershipId: userMembershipId,
    } = existingUser;
    return NextResponse.json({
      user: {
        name,
        email: userEmail,
        userRole,
        membershipId: userMembershipId,
      },
      firstLogin,
    });
  } catch (error: unknown) {
    console.error("Error in GET handler:", error);

    // Enhanced error handling
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "An internal server error occurred.", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { membershipId, password, question, answer } = await request.json();
    const firstLogin = searchParams.get("firstLogin");

    // Validate firstLogin query parameter
    if (!firstLogin) {
      return NextResponse.json(
        { error: "Invalid Request. 'firstLogin' parameter is required." },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!membershipId || !password) {
      return NextResponse.json(
        { error: "Both 'membershipId' and 'password' are required." },
        { status: 400 },
      );
    }

    // Fetch user from the database (only once)
    const existingUser = await db.user.findUnique({ where: { membershipId } });
    if (!existingUser) {
      return NextResponse.json(
        { error: `User with membershipId ${membershipId} was not found.` },
        { status: 404 },
      );
    }

    // Check user verification status
    if (existingUser.verificationStatus === "PENDING") {
      return NextResponse.json(
        { error: "User is not yet verified and cannot log in." },
        { status: 401 },
      );
    }
    if (existingUser.verificationStatus === "REJECTED") {
      return NextResponse.json(
        { error: "Membership request has been rejected. Cannot log in." },
        { status: 401 },
      );
    }

    // Create session user payload
    const sessionUser: SessionUser = {
      name: existingUser.name,
      email: existingUser.email,
      userRole: existingUser.userRole,
      membershipId: existingUser.membershipId!,
    };

    // Handle first login (password setting + security question)
    if (firstLogin === "true") {
      if (existingUser.password !== null) {
        return NextResponse.json(
          { error: "Password is already set. Cannot perform first login." },
          { status: 400 },
        );
      }

      // Ensure the user has selected a valid question and provided an answer
      if (!question || !answer) {
        return NextResponse.json(
          {
            error: "Security question and answer are required for first login.",
          },
          { status: 400 },
        );
      }

      // Validate the question (example, using enum or predefined list)
      if (!Object.values(SecurityQuestionType).includes(question)) {
        return NextResponse.json(
          { error: "Invalid security question." },
          { status: 400 },
        );
      }

      // Hash the answer and store the question-answer pair
      const hashedAnswer = await bcrypt.hash(answer, 10);
      await db.securityQuestion.create({
        data: {
          membershipId: membershipId,
          question,
          answer: hashedAnswer,
        },
      });

      // Hash the password and update the user record
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.user.update({
        where: { membershipId },
        data: { password: hashedPassword },
      });

      // Create a session and respond
      const session = await createSession(sessionUser);
      return generateSuccessResponse(request, sessionUser, session!);
    }

    // Handle regular login (password validation)
    if (firstLogin === "false") {
      if (existingUser.password === null) {
        return NextResponse.json(
          {
            error:
              "Password is not set for this user. First login is required.",
          },
          { status: 400 },
        );
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password,
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials. Please try again." },
          { status: 401 },
        );
      }

      // Create session and respond
      const session = await createSession(sessionUser);
      return generateSuccessResponse(request, sessionUser, session!);
    }

    // Handle invalid firstLogin parameter
    return NextResponse.json(
      {
        error:
          "Invalid 'firstLogin' parameter value. Must be 'true' or 'false'.",
      },
      { status: 400 },
    );
  } catch (error: unknown) {
    console.error("Error in POST handler:", error);

    // Enhanced error handling
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  }
}

function isMobileClient(request: NextRequest): boolean {
  const userAgent = request.headers.get("User-Agent") || "";
  return /Expo|okhttp|Darwin/.test(userAgent);
}

function generateSuccessResponse(
  request: NextRequest,
  sessionUser: SessionUser,
  session?: string,
) {
  const isMobile = isMobileClient(request);
  const response = { success: true, sessionUser, ...(isMobile && { session }) };

  return NextResponse.json(response);
}
