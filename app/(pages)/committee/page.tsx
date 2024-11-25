import CustomCarousel from "@/components/custom/custom-carousel";
import DistrictCommittee from "@/components/custom/district-committee";
import { StateCommittee } from "@/components/custom/state-members";
import Wrapper from "@/components/custom/wrapper";

export default function Committee() {
  return (
    <div className="bg-hero_img inset-0 bg-cover overflow-hidden">
      <Wrapper className="my-[5rem]">
        <CustomCarousel />
        <DistrictCommittee />
      </Wrapper>
    </div>
  );
}
