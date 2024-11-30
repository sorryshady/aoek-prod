import Wrapper from "@/components/custom/wrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { changeTypeToText } from "@/lib/utils";
import { commiteeUser } from "@/types/user-types";
import axios from "axios";
import Image from "next/image";



async function getData() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/general?committee=state&include=true`,
  );

  const members: commiteeUser[] = response.data;
  return { members };
}

export default async function StateCommitteePage() {
  const { members } = await getData();
  return (
    <TooltipProvider>
      <div className="relative min-h-screen py-24 bg-gradient-to-r from-[#464A66] to-[#2E6589]">
        <div className="absolute inset-0 bg-cover bg-body_img opacity-30 bg-top z-0"></div>
        <Wrapper className="min-h-[70vh] my-[5rem]">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white text-center mb-12">
              State Committee
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((member, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger>
                    <Card className="bg-white/95 backdrop-blur hover:scale-105 transition-transform duration-300">
                      <CardContent className="p-4 text-center capitalize">
                        <div className="aspect-square w-48 mx-auto mb-4 overflow-hidden rounded-lg">
                          <Image
                            src={member.photoUrl}
                            alt={`${member.name}'s photo`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-primary font-medium">
                          {changeTypeToText(member.designation)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {changeTypeToText(member.positionState)}
                        </p>
                      </CardContent>
                    </Card>
                  </TooltipTrigger>
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
                </Tooltip>
              ))}
            </div>
          </div>
        </Wrapper>
      </div>
    </TooltipProvider>
  );
}
