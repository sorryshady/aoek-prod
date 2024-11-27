import Wrapper from "@/components/custom/wrapper";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { homeEventsCard } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import placeholder from "../../../public/news-placeholder.webp";

// Pagination constants
const PAGE_SIZE = 12;

async function getData(page: number = 1) {
  // Calculate the start index based on the current page
  const start = (page - 1) * PAGE_SIZE;

  // Query to fetch paginated news with total count
  const query = `{
    "posts": *[_type == "news"] | order(_createdAt desc) [${start}...${start + PAGE_SIZE}] {
      title,
      image,
      description,
      content,
      date,
      "currentSlug": slug.current
    },
    "totalPosts": count(*[_type == "news"])
  }`;

  const data = await client.fetch(query);
  return {
    posts: data.posts,
    totalPosts: data.totalPosts,
    currentPage: page,
    totalPages: Math.ceil(data.totalPosts / PAGE_SIZE),
  };
}

export default async function News({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // Convert page to number, default to 1 if not provided
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;

  const { posts, totalPosts, totalPages } = await getData(currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#464A66] to-[#2E6589] py-24">
      <div className="absolute inset-0 bg-cover bg-body_img opacity-30 bg-top z-0"></div>
      <Wrapper className="relative z-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          View the latest news
        </h1>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {posts.map((post: homeEventsCard) => (
            <NewsCard key={post.currentSlug} post={post} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center space-x-4">
          {currentPage > 1 && (
            <Button
              variant="outline"
              asChild
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <Link
                href={
                  currentPage === 2
                    ? "/news" // For page 2, link back to clean URL
                    : `/news?page=${currentPage - 1}` // For other pages, use query param
                }
              >
                <ChevronLeft className="mr-2" /> Previous
              </Link>
            </Button>
          )}

          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (
            <Button
              variant="outline"
              asChild
              className="bg-white/20 text-white hover:bg-white/30"
            >
              <Link href={`/news?page=${currentPage + 1}`}>
                Next <ChevronRight className="ml-2" />
              </Link>
            </Button>
          )}
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
