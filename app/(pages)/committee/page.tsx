import DistrictCommittee from "@/components/custom/district-committee";
import { StateCommittee } from "@/components/custom/state-members";
import Wrapper from "@/components/custom/wrapper";
import { notFound } from "next/navigation";
import axios from "axios";

export const dynamic = "force-dynamic";
async function getData() {
  const stateRes = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/general?committee=state&include=false`
  );
  const districtRes = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/general?committee=district`
  );
  const stateCommittee = stateRes.data;
  const districtCommittee = districtRes.data;
  return { stateCommittee, districtCommittee };
}
export default async function Committee() {
  const { stateCommittee, districtCommittee } = await getData();
  if (!stateCommittee || !districtCommittee) return notFound();
  return (
    <div className="bg-hero_img inset-0 bg-cover overflow-hidden">
      <Wrapper className="my-[5rem]">
        <h1 className="text-center font-bold text-3xl mt-8">State Committee</h1>
        <StateCommittee members={stateCommittee} />
        <DistrictCommittee members={districtCommittee} />
      </Wrapper>
    </div>
  );
}
