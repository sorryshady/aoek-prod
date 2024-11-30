import { StateCommittee } from "@/components/custom/state-members";
import Wrapper from "@/components/custom/wrapper";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

async function getData() {
  const stateRes = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/general?committee=state&include=false`,
  );
  const stateCommittee = stateRes.data;
  return { stateCommittee };
}

export default async function Home() {
  const { stateCommittee } = await getData();
  return (
    <>
      <main className="w-full relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5386A4]/100 to-[#1F333E]/100 z-0 h-screen" />
        <div className="absolute inset-0 bg-cover bg-hero_img opacity-30 bg-top z-0" />
        <Wrapper className="min-h-screen relative z-10 lg:pt-28 w-full space-y-24 lg:space-y-32">
          <div className="flex flex-col gap-10 lg:flex-row justify-between items-center md:px-10 w-full mt-32">
            <div className="flex flex-col items-center lg:items-start gap-5 mx-auto h-full flex-1">
              <h1 className="uppercase text-3xl md:text-4xl xl:text-5xl text-white font-extrabold text-nowrap">
                Welcome to the
              </h1>
              <h1 className="uppercase text-3xl md:text-4xl xl:text-5xl text-white font-extrabold text-nowrap">
                Association Of
              </h1>
              <h1 className="uppercase text-3xl md:text-4xl xl:text-5xl text-white font-extrabold text-nowrap">
                Engineers Kerala
              </h1>
              <p className="text-white text-base md:text-lg">
                The Association of Engineers Kerala is a non-profit politically
                neutral organization representing working as well as retired
                engineers from the Public Works, Irrigation and Local Self
                Government Departments of the Government of Kerala
              </p>
              <div className="flex gap-5">
                <Button
                  asChild
                  variant={"destructive"}
                  className="text-base md:text-lg w-fit mt-5 font-bold py-5 px-8 rounded-xl shadow-xl"
                >
                  <Link href={"/contact"}>Contact Us</Link>
                </Button>
                <Button
                  asChild
                  variant={"default"}
                  className="text-base md:text-lg w-fit mt-5 font-bold py-5 px-8 rounded-xl shadow-xl bg-[#35718E] hover:bg-[#5386A4]"
                >
                  <Link href={"/about"}>About Us</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <Image
                src={"/aoek-logo.webp"}
                height={400}
                width={400}
                alt={"logo"}
                className="object-cover mx-auto w-[80%]"
              />
            </div>
          </div>
          <div className="hidden md:flex gap-10 text-white border-l-2 border-r-2 border-white px-10 py-5 w-fit mx-auto ">
            <div className="flex flex-col gap-3 items-center">
              <h4 className="text-3xl lg:text-4xl font-medium">3</h4>
              <p className="text-base lg:text-lg">Departments</p>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <h4 className="text-3xl lg:text-4xl font-medium">4000+</h4>
              <p className="text-base lg:text-lg">Members</p>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <h4 className="text-3xl lg:text-4xl font-medium">60+</h4>
              <p className="text-base lg:text-lg">Years of Service</p>
            </div>
          </div>
        </Wrapper>
        <Wrapper className="z-20 relative flex flex-col items-center gap-10 h-screen">
          <h2 className="text-[#20333C] text-5xl font-bold text-center mt-24">
            AOEK is now also available on Android & iOS
          </h2>
          <div className="fit">
            <Image
              src={"/app-download.webp"}
              width={1000}
              height={1000}
              className="mx-auto object-cover"
              alt="App download"
            />
          </div>
          <h3 className="text-4xl font-bold">Download Now</h3>
          <div className="flex gap-5 w-full justify-center items-center">
            <Button
              asChild
              className=" font-bold w-48 shadow-xl"
              variant={"destructive"}
            >
              <Link href={"/"}>For Android</Link>
            </Button>
            <Button
              asChild
              className=" font-bold w-48 shadow-xl"
              variant={"destructive"}
            >
              <Link href={"/"}>For iOS</Link>
            </Button>
          </div>
        </Wrapper>
      </main>
      <div className="z-20 relative bg-gradient-to-b from-[#5386A4]/100 to-[#1F333E]/100 pb-20">
        <h2 className="text-white text-4xl font-semibold text-center py-12">
          Meet Our State Committee Members
        </h2>
        <Wrapper>
          <StateCommittee members={stateCommittee} />
        </Wrapper>
      </div>
    </>
  );
}
