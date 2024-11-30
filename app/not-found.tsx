import Wrapper from "@/components/custom/wrapper";
import Link from "next/link";

import React from "react";

export default function NotFound() {
  return (
    <div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#5386A4]/100 to-[#1F333E]/100 z-0 h-screen" />
      <div className="absolute inset-0 bg-cover bg-hero_img opacity-30 bg-top z-0" />
      <Wrapper className="relative z-20 flex justify-center items-center min-h-[70vh] flex-col gap-2">
        <h1 className="font-extrabold text-white text-7xl">404</h1>
        <h2 className="text-5xl font-bold text-white">Not Found</h2>
        <p className="text-white text-2xl">
          The page you are looking for does not exist.
        </p>
        <p className="text-white text-base mt-5">
          Click here to go back to the{" "}
          <Link href="/" className="font-bold underline">
            home page
          </Link>
        </p>
      </Wrapper>
    </div>
  );
}
