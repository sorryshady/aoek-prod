import Wrapper from "@/components/custom/wrapper";
import { Card, CardContent } from "@/components/ui/card";
import { changeTypeToText } from "@/lib/utils";
import { commiteeUser } from "@/types/user-types";
import axios from "axios";
import Image from "next/image";

export const dynamic = "force-dynamic";
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
    <div className="relative min-h-screen py-24 bg-gradient-to-r from-[#464A66] to-[#2E6589]">
      <div className="absolute inset-0 bg-cover bg-body_img opacity-30 bg-top z-0"></div>
      <Wrapper className="min-h-[70vh] my-[5rem]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-12">
            State Committee
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur">
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
            ))}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
