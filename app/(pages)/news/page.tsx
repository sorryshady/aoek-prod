import Wrapper from "@/components/custom/wrapper";
import { client } from "@/lib/sanity";
import { simpleNewsCard } from "@/types";

export const revalidate = 0;
async function getData() {
  const query = `*[_type == "news"]| order(_createdAt desc) {
        title,
        image,
        description,
        content,
        date,
        "currentSlug": slug.current
      }`;
  const data = await client.fetch(query);
  return data;
}
export default async function News() {
  const data: simpleNewsCard[] = await getData();
  return (
    <Wrapper>
      <h1>News Page</h1>
      <div>
        No of article: <span className="font-bold">{data.length}</span>
      </div>
    </Wrapper>
  );
}
