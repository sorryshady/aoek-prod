"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <>
      <div>
        <h1 className="text-center text-2xl font-bold text-white ">
          Meet Our State Commitee Members
        </h1>
      </div>
      <div className="flex justify-center items-center w-full">
        {/* Centering Wrapper */}
        <Carousel
          plugins={[plugin.current]}
          className="w-full max-w-4xl" // Adjusted width for 4 cards
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="flex space-x-4">
            {" "}
            {/* Adjust spacing */}
            {Array.from({ length: 8 }).map(
              (
                _,
                index // Increased items to better showcase 4 cards
              ) => (
                <CarouselItem
                  key={index}
                  className="flex-[0_0_25%]" // Each card takes up 1/4 of the carousel width
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-4xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  );
}
