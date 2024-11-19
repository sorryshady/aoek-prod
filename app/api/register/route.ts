"use server";
import { db } from "@/db";
import { backendRegisterSchema } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "date-fns";

export async function POST(request: NextRequest) {
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
    const { error } = validatedFields;
    return NextResponse.json({ error: error.issues }, { status: 400 });
  }

  const { email } = validatedFields.data;
  try {
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
  } catch (error) {
    // Catching any error that arises during access of database.
    return NextResponse.json({ error }, { status: 500 });
  }
}
