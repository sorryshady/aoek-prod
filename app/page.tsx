import AoekBanner from "@/components/custom/aoek-ios-android";
import EventsHome from "@/components/custom/event-card-home";
import NewsHome from "@/components/custom/news-card-home";
import Wrapper from "@/components/custom/wrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../public/aoek-logo.png";
import whitebridge from "../public/white-bridge.png";
import DistrictCommittee from "@/components/custom/district-committee";
import { Carousel } from "@/components/ui/carousel";
import { StateCommittee } from "@/components/custom/state-members";

export default function Home() {
  return (
    <div className="w-full bg-gradient-to-b from-blue-300 to-blue-500 min-h-screen pt-20 ">
      <div className="absolute">
        <Image
          src={whitebridge}
          alt="white bridge"
          objectFit="cover"
          layout="fill"
        />
      </div>
      <Wrapper>
        <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-12">
          {/* Left Section */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl font-bold text-white leading-tight">
              WELCOME TO THE ASSOCIATION OF ENGINEERS KERALA
            </h1>
            <p className="text-white max-w-lg mx-auto lg:mx-0">
              The Association of Engineer Kerala is a non-profit politically
              neutral organization representing working as well as retired
              engineers from the Public Works, Irrigation and Local Self
              Government Departments of the Government of Kerala.
            </p>
            <Button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md">
              Contact Us
            </Button>
          </div>

          {/* Right Section */}
          {/* <div className="lg:w-1/2">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h2 className="text-gray-800 font-semibold text-lg mb-4 text-center">
                Upcoming Events
              </h2>
              <EventsHome />
            </div>
          </div> */}
          <div className="lg:w-1/2 flex items-center justify-end">
            <Image src={logo} alt="aoek logo" width={400} height={400} />
            {/* <img src="/logo.png" alt="aoek logo" width={50} height={50} /> */}
          </div>
        </div>
        <NewsHome />
      </Wrapper>
      <AoekBanner />
      <Wrapper>
        <StateCommittee />
      </Wrapper>
    </div>
  );
}
