"use server";
import { db } from "@/db";
import { backendRegisterSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "date-fns";

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
export async function POST(request: NextRequest) {
  try {
    let formData = await request.json();

    if (!formData) {
      return NextResponse.json(
        { error: "No form data received" },
        { status: 400 },
      );
    }
    //  dob comes from frontend in the dd/mm/yyyy format because of our logic. Should convert it into date object
    const date = parse(formData.dob, "dd/MM/yyyy", new Date());
    formData = { ...formData, dob: date };

    // checking if incoming form data is valid
    const validatedFields = backendRegisterSchema.safeParse(formData);
    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid Fields" }, { status: 400 });
    }
    const { email } = validatedFields.data;

    // trying to check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with email already exists!" },
        { status: 400 },
      );
    }
    // create user if user does not already exist
    await db.user.create({ data: validatedFields.data });
    return NextResponse.json(
      {
        success:
          "User created successfully! Wait for admin approval before login.",
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    // General errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Catching any error that arises during access of database.
    return NextResponse.json({ error }, { status: 500 });
  }
}
