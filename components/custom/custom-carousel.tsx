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
import Link from "next/link";
import Image from "next/image";
import Wrapper from "./wrapper";

const committeeMembers = [
  {
    name: "Sajish R",
    role: "President",
    image: "/news-placeholder.webp",
  },
  {
    name: "Sudheel V",
    role: "Vice President",
    image: "/news-placeholder.webp",
  },
  {
    name: "Devakumar FK",
    role: "General Secretary",
    image: "/news-placeholder.webp",
  },
  {
    name: "Alexander K Thomas",
    role: "Joint Secretary",
    image: "/news-placeholder.webp",
  },
  {
    name: "Alexander K Thomas",
    role: "Joint Secretary",
    image: "/news-placeholder.webp",
  },
  {
    name: "Alexander K Thomas",
    role: "Joint Secretary",
    image: "/news-placeholder.webp",
  },
];

const CustomCarousel = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 1500, stopOnInteraction: true }),
  );

  return (
    <Wrapper className="w-full  mx-auto px-4 py-8">
      <Card className="bg-transparent shadow-none border-none p-8 rounded-lg">
        <CardContent className="p-0">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
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
            <Button
              asChild
              variant={"default"}
              className="text-base md:text-lg w-fit mt-5 font-bold py-5 px-8 rounded-xl shadow-xl bg-[#35718E] hover:bg-[#5386A4]"
            >
              <Link href="/committee/state-members">View all members</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default CustomCarousel;
