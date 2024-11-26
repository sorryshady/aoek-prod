import Wrapper from "@/components/custom/wrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axios from "axios";
import Image from "next/image";

export const dynamic = "force-dynamic";
async function getData() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/general?committee=state&include=true`
  );

  const members = response.data;
  return { members };
}
export default async function StateCommitteePage() {
  const { members } = await getData();
  console.log(members);
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-800 to-teal-700 py-12 px-4">
      <Wrapper className="min-h-[70vh] my-[5rem]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-12">
            State Committee
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur">
                <CardContent className="p-4 text-center">
                  <div className="aspect-square w-48 mx-auto mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={member.imageUrl}
                      alt={`${member.name}'s photo`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium">{member.role}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
