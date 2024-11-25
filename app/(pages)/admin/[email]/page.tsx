import ActionButtons from "@/app/(pages)/admin/[email]/action-buttons";
import Wrapper from "@/components/custom/wrapper";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { changeTypeToText, excludeFields } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";

async function getData(email: string) {
  const existingUser = await db.user.findUnique({
    where: { email },
  });
  if (!existingUser) {
    return notFound();
  }
  const returnUser = excludeFields(existingUser, [
    "password",
    "createdAt",
    "updatedAt",
    "committeeType",
    "userRole",
    "photoId",
    "positionDistrict",
    "positionState",
    "razorpayId",
    "membershipId",
    "verificationStatus",
  ]);
  return { user: returnUser };
}
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  const { user } = await getData(decodeURIComponent(email));
  return (
    <Wrapper className="my-[5rem] min-h-[70vh] flex justify-center items-center">
      <div className="max-w-6xl mx-auto pt-10">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
            <Image
              src={user.photoUrl || "/fall-back.webp"}
              alt={user.name}
              width={150}
              height={150}
              className="rounded-full mb-4 md:mb-0 md:mr-8"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-xl text-muted-foreground mb-4">{user.email}</p>
              <ActionButtons email={user.email} />
            </div>
          </div>
          <Separator />
          {/* Personal Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
              <InfoField label="Name" value={user.name} />
              <InfoField
                label="Date of Birth"
                value={new Date(user.dob).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <InfoField label="Gender" value={changeTypeToText(user.gender)} />
              <InfoField
                label="Blood Group"
                value={changeTypeToText(user.bloodGroup)}
              />
              <InfoField
                label="User Status"
                value={changeTypeToText(user.userStatus)}
              />
            </div>
          </section>

          <Separator />

          {/* Employment Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Employment Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              <InfoField
                label="Department"
                value={changeTypeToText(user.department || "N/A")}
              />
              <InfoField
                label="Designation"
                value={changeTypeToText(user.designation || "N/A")}
              />
              <InfoField
                label="Office Address"
                value={user.officeAddress || "N/A"}
              />
              <InfoField
                label="Work District"
                value={changeTypeToText(user.workDistrict || "N/A")}
              />
            </div>
          </section>

          <Separator />

          {/* Permanent Address */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Permanent Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              <InfoField label="Address" value={user.personalAddress} />
              <InfoField
                label="Home District"
                value={changeTypeToText(user.homeDistrict)}
              />
            </div>
          </section>

          <Separator />

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 gap-y-4">
              <InfoField label="Email" value={user.email} />
              <InfoField
                label="Phone Number"
                value={user.phoneNumber || "N/A"}
              />
              <InfoField label="Mobile Number" value={user.mobileNumber} />
            </div>
          </section>
        </div>
      </div>
    </Wrapper>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 items-start">
      <span className="w-32 font-medium text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
