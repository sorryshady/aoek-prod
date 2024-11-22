import DistrictCommittee from "@/components/custom/district-committee";
import { StateCommittee } from "@/components/custom/state-members";
import Wrapper from "@/components/custom/wrapper";

export default function Committee() {
  return (
    <div>
      <Wrapper>
        <StateCommittee />
        <DistrictCommittee />
      </Wrapper>
    </div>
  );
}
