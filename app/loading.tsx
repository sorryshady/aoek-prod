import Wrapper from "@/components/custom/wrapper";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#5386A4]/100 to-[#1F333E]/100 z-0 h-screen" />
      <div className="absolute inset-0 bg-cover bg-hero_img opacity-30 bg-top z-0" />
      <Wrapper className="relative z-20 flex flex-col gap-2 justify-center items-center">
        <Loader2 className="h-14 w-14 animate-spin text-white" />
        <p className="text-white text-2xl font-bold">Loading...</p>
      </Wrapper>
    </div>
  );
}
