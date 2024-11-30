"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { commiteeUser } from "@/types/user-types";

interface StateCommitteeProps {
  members: commiteeUser[];
}

export function StateCommittee({ members }: StateCommitteeProps) {
  const [api, setApi] = React.useState<any>();
  const [, setCurrent] = React.useState(0);
  const [, setCount] = React.useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const autoplay = React.useRef(
    Autoplay({ delay: 1500, stopOnInteraction: true }),
  );

  return (
    <TooltipProvider>
      <div className="w-full mx-auto px-4 py-8">
        <Card className="bg-[#1a2634] p-8 rounded-lg">
          <CardContent className="p-0">
            <Carousel
              plugins={[autoplay.current]}
              className="w-full"
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
              setApi={setApi}
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {members.map((member, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4"
                  >
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex flex-col items-center p-2">
                          <div className="w-full aspect-square mb-2">
                            <Image
                              width={600}
                              height={600}
                              src={member.photoUrl}
                              alt={member.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <h3 className="text-white font-medium text-center">
                            {member.name}
                          </h3>
                          <p className="text-gray-400 text-sm text-center capitalize">
                            {member.positionState
                              .toLowerCase()
                              .split("_")
                              .join(" ")}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#2d4153] text-white">
                        <div className="space-y-1">
                          <p>
                            <strong>Blood Group:</strong> {member.bloodGroup}
                          </p>
                          <p>
                            <strong>Designation:</strong>{" "}
                            {member.designation
                              .toLowerCase()
                              .split("_")
                              .join(" ")}
                          </p>
                          <p>
                            <strong>Membership ID:</strong>{" "}
                            {member.membershipId}
                          </p>
                          <p>
                            <strong>Mobile Number:</strong>{" "}
                            {member.mobileNumber}
                          </p>
                          <p>
                            <strong>Personal Address:</strong>{" "}
                            {member.personalAddress}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Carousel>
            <div className="flex justify-center mt-6">
              <Button
                asChild
                variant="secondary"
                className="bg-[#2d4153] text-white hover:bg-[#375169]"
              >
                <Link href="/committee/state-committee">View all members</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
