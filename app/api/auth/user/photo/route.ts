import { db } from "@/db";
import { utapi } from "@/lib/utapi";
import { excludeFields } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const token = (await cookies()).get("session")?.value;
  const { searchParams } = request.nextUrl;
  const fileId = searchParams.get("fileId");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!fileId) {
    return NextResponse.json(
      { error: "Need file ID to delete photo" },
      { status: 401 },
    );
  }
  try {
    const res = await utapi.deleteFiles(fileId);
    const { success } = res;
    if (success) {
      return NextResponse.json(
        { success: "Image has been deleted!" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const token = (await cookies()).get("session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { membershipId, photoUrl, photoId } = await request.json();
  try {
    const user = await db.user.update({
      where: { membershipId },
      data: { photoUrl, photoId },
    });
    const safeUser = excludeFields(user, [
      "password",
      "createdAt",
      "updatedAt",
    ]);
    return NextResponse.json(
      { success: "Image has been updated!", photoUrl, safeUser },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
