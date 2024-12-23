"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import {
  BloodGroup,
  Designation,
  District,
  DistrictPositionTitle,
} from "@prisma/client";
import { changeTypeToText } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Member {
  name: string;
  designation: Designation;
  membershipId: number;
  bloodGroup: BloodGroup;
  mobileNumber: string;
  personalAddress: string;
  positionDistrict: DistrictPositionTitle;
  photoUrl: string;
  workDistrict: District;
}

export default function DistrictCommittee({
  members,
}: {
  members: Record<string, Member[]>;
}) {
  const [selectedDistrict, setSelectedDistrict] = useState("KASARAGOD");

  const handleDistrictClick = (districtName: string) => {
    setSelectedDistrict(districtName);
  };

  return (
    <div className="w-full  mx-auto p-4">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
            {Object.values(District).map((district) => (
              <button
                key={district}
                onClick={() => handleDistrictClick(district)}
                className={`px-2 py-1 text-sm sm:text-base text-white hover:text-gray-300 transition-colors capitalize ${
                  district === selectedDistrict
                    ? "text-yellow-300 hover:text-yellow-200"
                    : ""
                }`}
              >
                {district.toLowerCase()}
              </button>
            ))}
          </div>
        </CardHeader>
        <TooltipProvider>
          <CardContent className="bg-sky-100/50 p-8">
            <div className="flex flex-wrap gap-10 justify-items-center">
              {members[selectedDistrict]?.map((member, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger>
                    <Card
                      key={index}
                      className="w-full max-w-[250px] border-0 shadow text-center"
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square w-48 mx-auto mb-4 overflow-hidden rounded-md">
                          <Image
                            width={600}
                            height={600}
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {changeTypeToText(member.positionDistrict)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {changeTypeToText(member.designation)}
                        </p>
                      </CardContent>
                    </Card>
                    <TooltipContent className="bg-[#2d4153] text-white shadow-lg border">
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Blood Group:</strong>{" "}
                          {changeTypeToText(member.bloodGroup)}
                        </p>
                        <p>
                          <strong>Designation:</strong>{" "}
                          {changeTypeToText(member.designation)}
                        </p>
                        <p>
                          <strong>Membership ID:</strong> {member.membershipId}
                        </p>
                        <p>
                          <strong>Mobile Number:</strong> {member.mobileNumber}
                        </p>
                        <p>
                          <strong>Personal Address:</strong>{" "}
                          {member.personalAddress}
                        </p>
                      </div>
                    </TooltipContent>
                  </TooltipTrigger>
                </Tooltip>
              ))}
              {!members[selectedDistrict] && (
                <p className="text-gray-500 text-center w-full">
                  No members found for this district.
                </p>
              )}
            </div>
          </CardContent>
        </TooltipProvider>
      </Card>
    </div>
  );
}
