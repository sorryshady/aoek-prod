"use server";
import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("email");
  if (!query) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const exisitingUser = await db.user.findUnique({
    where: { email: query },
  });
  if (exisitingUser) {
    return NextResponse.json(
      { error: "User already exists!" },
      { status: 400 },
    );
  } else {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
