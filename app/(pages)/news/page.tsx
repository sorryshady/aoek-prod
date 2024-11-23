import Wrapper from "@/components/custom/wrapper";
<<<<<<< HEAD
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { homeEventsCard } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
=======
import { client } from "@/lib/sanity";
import { simpleNewsCard } from "@/types";

export const revalidate = 0;
>>>>>>> 5ad193298d3a2acd09c865f3fc05a897c0e57550
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
<<<<<<< HEAD
=======
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
>>>>>>> 5ad193298d3a2acd09c865f3fc05a897c0e57550
}
export default async function News() {
  const data: homeEventsCard[] = await getData();
  return (
    <Wrapper>
      <h1 className="text-5xl font-bold text-center">News Feed</h1>
      <div className="flex mx-auto flex-col items-center gap-10">
        {data.map((post) => {
          return <NewsCard key={post.currentSlug} post={post} />;
        })}
      </div>
    </Wrapper>
  );
}

const NewsCard = ({ post }: { post: homeEventsCard }) => {
  return (
    <Card className="lg:w-[40vw] w-full flex mx-auto overflow-hidden rounded-md flex-col">
      {post.image ? (
        <Image
          src={urlFor(post.image).url()}
          alt={post.title}
          width={600}
          height={600}
          className="w-full h-[20rem] object-cover"
        />
      ) : (
        <Image
          src="/news-placeholder.webp"
          alt="Placeholder"
          width={600}
          height={400}
          className="w-full h-[20rem] object-cover"
        />
      )}
      <div className="flex flex-col gap-3 p-5">
        <h2 className="font-bold text-2xl line-clamp-2">{post.title}</h2>
        <p className="text-base text-gray-600 font-semibold">
          {post.description}
        </p>
        <Separator />
        <Link
          className="block space-x-3 text-end text-base hover:text-primary"
          href={`/news/${post.currentSlug}`}
        >
          Read More <ArrowRight size={18} className="inline" />
        </Link>
      </div>
    </Card>
  );
};
