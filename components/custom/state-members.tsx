/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const committeeMembers = [
  {
    name: "Sajish R",
    role: "President",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Sudheel V",
    role: "Vice President",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Devakumar FK",
    role: "General Secretary",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Alexander K Thomas",
    role: "Joint Secretary",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Alexander K Thomas",
    role: "Joint Secretary",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Alexander K Thomas",
    role: "Joint Secretary",
    image: "/placeholder.svg?height=200&width=200",
  },
];

export function StateCommittee() {
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

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
    Autoplay({ delay: 1500, stopOnInteraction: true })
  );

  return (
    <div className="w-full  mx-auto px-4 py-8">
      <h1 className="text-center text-3xl font-extrabold mb-8">
        State Committee
      </h1>
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
              {committeeMembers.map((member, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4"
                >
                  <div className="flex flex-col items-center p-2">
                    <div className="w-full aspect-square mb-2">
                      <Image
                        width={600}
                        height={600}
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <h3 className="text-white font-medium text-center">
                      {member.name}
                    </h3>
                    <p className="text-gray-400 text-sm text-center">
                      {member.role}
                    </p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
          <div className="flex justify-center mt-6">
            <Link href="committee/state-members">
              <Button
                variant="secondary"
                className="bg-[#2d4153] text-white hover:bg-[#375169]"
              >
                View all members
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
