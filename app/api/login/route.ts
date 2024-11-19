"use server";

import { db } from "@/db";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";
import { SessionUser } from "@/types";
export async function GET(request: NextRequest) {
  try {
    let existingUser: User | null = null;
    // accessing search params to check for email or membershipId
    const { searchParams } = request.nextUrl;
    const email = searchParams.get("email");
    const membershipId = searchParams.get("membershipId");

    // If neither is present, return error response
    if (!email && !membershipId) {
      return NextResponse.json(
        { error: "Email or membershipId is required!" },
        { status: 400 },
      );
    } else if (email && membershipId) {
      return NextResponse.json(
        { error: "Only one of email or membershipId is allowed!" },
        { status: 400 },
      );
    }
    // if email is present, find user using email
    if (email) {
      existingUser = await db.user.findUnique({ where: { email } });
      if (!existingUser) {
        return NextResponse.json(
          { error: "User with email not found!" },
          { status: 404 },
        );
      }
    }
    // If membershipId is present, find user using membershipId
    if (membershipId) {
      existingUser = await db.user.findUnique({
        where: { membershipId: Number(membershipId) },
      });
      if (!existingUser) {
        return NextResponse.json(
          { error: "User with membershipId not found!" },
          { status: 404 },
        );
      }
    }
    // Check if password field is empty and return the appropriate response
    if (existingUser) {
      const { password, name, email, membershipId, verificationStatus } =
        existingUser;
      if (verificationStatus === "PENDING") {
        return NextResponse.json(
          { error: "User is not yet verified! Cannot login." },
          { status: 401 },
        );
      } else if (verificationStatus === "REJECTED") {
        return NextResponse.json(
          { error: "Membership request has been rejected! Cannot login." },
          { status: 401 },
        );
      }
      // Check if password is empty (if it is an empty string or null)
      const firstLogin = !password;

      // Return response with firstLogin field
      return NextResponse.json({
        user: { name, email, membershipId },
        firstLogin,
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { membershipId, password } = await request.json();
    const firstLogin = searchParams.get("firstLogin");

    if (!firstLogin) {
      return NextResponse.json({ error: "Invalid Request" }, { status: 404 });
    }

    // check if membershipId and password are present in request body
    if (!membershipId || !password) {
      return NextResponse.json(
        { error: "membershipId and password are required" },
        { status: 400 },
      );
    }
    // check if membershipId is valid
    const existingUser = await db.user.findUnique({
      where: { membershipId },
    });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User with membershipId not found!" },
        { status: 404 },
      );
    }
    // check user verification status
    if (existingUser.verificationStatus === "PENDING") {
      return NextResponse.json(
        { error: "User is not yet verified! Cannot login." },
        { status: 401 },
      );
    } else if (existingUser.verificationStatus === "REJECTED") {
      return NextResponse.json(
        { error: "Membership request has been rejected! Cannot login." },
        { status: 401 },
      );
    }
    const sessionUser: SessionUser = {
      name: existingUser.name,
      email: existingUser.email,
      userRole: existingUser.userRole,
      membershipId: existingUser.membershipId!,
    };
    // // check if password setting or password login
    if (firstLogin === "true" && existingUser.password === null) {
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      //   update db with new password
      await db.user.update({
        where: { membershipId },
        data: { password: hashedPassword },
      });
      //   create Session
      const session = await createSession(sessionUser);
      //   Sending session token and sessionUser to app clients
      if (
        request.headers.get("User-Agent")?.includes("Expo") ||
        request.headers.get("User-Agent")?.includes("okhttp") ||
        request.headers.get("User-Agent")?.includes("Darwin")
      ) {
        return NextResponse.json({ success: true, sessionUser, session });
      }
      //   returning sessionUser for web clients
      return NextResponse.json({ success: true, sessionUser });
    } else if (firstLogin === "false" && existingUser.password !== null) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password!,
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }
      //   create Session
      const session = await createSession(sessionUser);
      //   Sending session token and sessionUser to app clients
      if (
        request.headers.get("User-Agent")?.includes("Expo") ||
        request.headers.get("User-Agent")?.includes("okhttp") ||
        request.headers.get("User-Agent")?.includes("Darwin")
      ) {
        return NextResponse.json({ success: true, sessionUser, session });
      }
      //   returning sessionUser for web clients
      return NextResponse.json({ success: true, sessionUser });
    } else {
      return NextResponse.json(
        { error: "Invalid login attempt" },
        { status: 400 },
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 },
      );
    }
  }
}
