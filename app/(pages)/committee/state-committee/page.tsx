import Wrapper from "@/components/custom/wrapper";
import axios from "axios";

export const dynamic = "force-dynamic";
async function getData() {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/general?committee=state&include=true`,
  );

  const members = response.data;
  return { members };
}
export default async function StateCommitteePage() {
  const { members } = await getData();
  return (
    <Wrapper className="min-h-[70vh] my-[5rem]">
      <h1 className="text-5xl font-bold text-center">State Committee Page</h1>
    </Wrapper>
  );
}
