"use server";
import { db } from "@/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const { searchParams } = request.nextUrl;
//   const query = searchParams.get("email");
//   if (!query) {
//     return NextResponse.json({ error: "Email is required" }, { status: 400 });
//   }

//   const exisitingUser = await db.user.findUnique({
//     where: { email: query },
//   });
//   if (exisitingUser) {
//     return NextResponse.json(
//       { error: "User already exists!" },
//       { status: 400 },
//     );
//   } else {
//     return NextResponse.json({ success: true }, { status: 200 });
//   }
// }

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("committee");
  const query2 = searchParams.get("include");

  switch (query) {
    case "state": {
      const where: Prisma.UserWhereInput = {
        committeeType: "STATE",
        NOT:
          query2 === "false"
            ? [{ positionState: "EXECUTIVE_COMMITTEE_MEMBER" }]
            : undefined,
      };
      const stateCommittee = await db.user.findMany({
        where,
        select: {
          name: true,
          designation: true,
          photoUrl: true,
          positionState: true,
          membershipId: true,
          mobileNumber: true,
          personalAddress: true,
          bloodGroup: true,
        },
      });
      return NextResponse.json(stateCommittee, { status: 200 });
    }
    case "district": {
      const districtCommittee = await db.user.findMany({
        where: { committeeType: "DISTRICT" },
        select: {
          name: true,
          designation: true,
          photoUrl: true,
          positionState: true,
          membershipId: true,
          mobileNumber: true,
          personalAddress: true,
          bloodGroup: true,
          workDistrict: true,
        },
      });
      // Group data by workDistrict
      const groupedByDistrict = districtCommittee.reduce(
        (acc, member) => {
          const district = member.workDistrict;
          if (!acc[district!]) {
            acc[district!] = [];
          }
          acc[district!].push(member);
          return acc;
        },
        {} as Record<string, typeof districtCommittee>,
      );
      return NextResponse.json(groupedByDistrict, { status: 200 });
    }
    default: {
      return NextResponse.json(
        { error: "Invalid committee type" },
        { status: 400 },
      );
    }
  }
}
