import Wrapper from "@/components/custom/wrapper";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { homeEventsCard } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import placeholder from "../../../public/news-placeholder.webp";

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
  const data: homeEventsCard[] = await getData();

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#464A66] to-[#2E6589] py-24">
      <div className="absolute inset-0 bg-cover bg-body_img opacity-30 bg-top z-0"></div>
      <Wrapper>
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          View the latest news
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((post) => (
            <NewsCard key={post.currentSlug} post={post} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Wrapper>
    </div>
  );
}

const NewsCard = ({ post }: { post: homeEventsCard }) => {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg bg-white/95 backdrop-blur hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        {post.image ? (
          <Image
            src={urlFor(post.image).url()}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src={placeholder}
            alt="Placeholder"
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-3 p-4">
        <h2 className="font-bold text-lg line-clamp-2 min-h-[3.5rem]">
          {post.title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-3">{post.description}</p>
        <Separator />
        <Link
          className="flex items-center justify-end gap-2 text-sm hover:text-primary transition-colors"
          href={`/news/${post.currentSlug}`}
        >
          Read More
          <ArrowRight size={16} />
        </Link>
      </div>
    </Card>
  );
};
