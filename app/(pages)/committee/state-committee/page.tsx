import Wrapper from "@/components/custom/wrapper";

async function getData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/general?committee=state&include=true`,
  );
  const members = await response.json();
  return { members };
}
export default async function StateCommitteePage() {
  const { members } = await getData();
  console.log(members);
  return (
    <Wrapper className="min-h-[70vh] my-[5rem]">
      <h1 className="text-5xl font-bold text-center">State Committee Page</h1>
    </Wrapper>
  );
}
