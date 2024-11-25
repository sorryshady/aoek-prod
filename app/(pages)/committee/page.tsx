import DistrictCommittee from "@/components/custom/district-committee";
import { StateCommittee } from "@/components/custom/state-members";
import Wrapper from "@/components/custom/wrapper";

async function getData() {
  const stateRes = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/general?committee=state&include=false`,
  );
  const districtRes = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/general?committee=district`,
  );
  const stateCommittee = await stateRes.json();
  const districtCommittee = await districtRes.json();
  return { stateCommittee, districtCommittee };
}
export default async function Committee() {
  const { stateCommittee, districtCommittee } = await getData();
  return (
    <div>
      <Wrapper className="my-[5rem]">
        <StateCommittee members={stateCommittee} />
        <DistrictCommittee members={districtCommittee} />
      </Wrapper>
    </div>
  );
}
