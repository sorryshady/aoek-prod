import { db } from "@/db";
import { decrypt } from "@/lib/session";
import { SessionPayload } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");

    switch (type) {
      case "update": {
        const token = (await cookies()).get("session")?.value;

        if (!token) {
          return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
          );
        }

        const { user } = (await decrypt(token)) as SessionPayload;

        // Find user in database
        const exisitingUser = await db.user.findUnique({
          where: { membershipId: user.membershipId! },
          include: { securityQuestion: true },
        });

        if (!exisitingUser) {
          return NextResponse.json(
            { message: "User not found" },
            { status: 404 },
          );
        }
        const body = await request.json();
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
          return NextResponse.json(
            { message: "Current password and new password are required" },
            { status: 400 },
          );
        }
        // Verify current password
        const isPasswordValid = await bcrypt.compare(
          currentPassword,
          exisitingUser.password!,
        );
        const isPasswordSame = await bcrypt.compare(
          newPassword,
          exisitingUser.password!,
        );

        if (!isPasswordValid) {
          return NextResponse.json(
            { message: "Current password is incorrect" },
            { status: 401 },
          );
        }
        if (isPasswordSame) {
          return NextResponse.json(
            {
              message:
                "New password cannot be the same as the current password",
            },
            { status: 400 },
          );
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.user.update({
          where: { membershipId: exisitingUser.membershipId! },
          data: { password: hashedNewPassword },
        });
      }
      case "reset": {
        const body = await request.json();
        const { membershipId, email, answer, password } = body;
        if (!membershipId || !email) {
          return NextResponse.json(
            { message: "Missing membership id or email" },
            { status: 400 },
          );
        }
        const exisitingUser = await db.user.findUnique({
          where: { membershipId: Number(membershipId) },
          include: { securityQuestion: true },
        });

        if (!exisitingUser) {
          return NextResponse.json(
            { message: "User not found" },
            { status: 404 },
          );
        }

        if (!answer || !password) {
          return NextResponse.json(
            { message: "Missing answer or password" },
            { status: 400 },
          );
        }

        // Verify answer
        const isAnswerValid = await bcrypt.compare(
          answer,
          exisitingUser.securityQuestion[0].answer,
        );
        const isPasswordSame = await bcrypt.compare(
          password,
          exisitingUser.password!,
        );

        if (!isAnswerValid) {
          return NextResponse.json(
            { message: "Answer is incorrect" },
            { status: 401 },
          );
        }

        if (isPasswordSame) {
          return NextResponse.json(
            {
              message:
                "New password cannot be the same as the current password",
            },
            { status: 400 },
          );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password
        await db.user.update({
          where: { membershipId: exisitingUser.membershipId! },
          data: { password: hashedPassword },
        });
      }
    }

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Password change error:", error);
    // Handle other errors
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const email = searchParams.get("email");
  const membershipId = searchParams.get("membershipId");

  if (!email || !membershipId) {
    return NextResponse.json(
      { message: "Missing email or membershipId" },
      { status: 400 },
    );
  }

  const user = await db.user.findFirst({
    where: {
      OR: [{ email: email }, { membershipId: Number(membershipId) }],
    },
    include: {
      securityQuestion: {
        select: {
          question: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}
