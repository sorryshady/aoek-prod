import Wrapper from "@/components/custom/wrapper";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GalleryData } from "@/types/sanity-types";
import { client } from "@/lib/sanity";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
async function getData() {
  const query = `*[_type == "gallery"]| order(_createdAt desc) {
        title,
         "currentSlug": slug.current
      }`;
  const data = await client.fetch(query);
  return data;
}
export default async function Gallery() {
  const data: GalleryData[] = await getData();
  return (
    <Wrapper className="mt-32">
      <h1 className="text-5xl font-bold text-center">Gallery</h1>
      <div className="flex mx-auto flex-col items-center gap-10">
        {data.map((post) => {
          return <GalleryCard key={post.currentSlug} post={post} />;
        })}
      </div>
    </Wrapper>
  );
}

const GalleryCard = ({ post }: { post: GalleryData }) => {
  return (
    <Card className="lg:w-[40vw] w-full flex mx-auto overflow-hidden rounded-md flex-col">
      <div className="flex flex-col gap-3 p-5">
        <h2 className="font-bold text-2xl line-clamp-2">{post.title}</h2>
        <Separator />
        <Link
          className="block space-x-3 text-end text-base hover:text-primary"
          href={`/gallery/${post.currentSlug}`}
        >
          Show More <ArrowRight size={18} className="inline" />
        </Link>
      </div>
    </Card>
  );
};
