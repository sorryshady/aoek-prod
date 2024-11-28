// app/gallery/[slug]/page.tsx
import { client } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

async function getData(slug: string) {
  const query = `*[_type == "gallery" && slug.current == $slug][0]{
    title,
    "images": images[]{
      "url": asset->url,
      alt
    }
  }`;
  return await client.fetch(query, { slug });
}

export default async function GalleryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const gallery = await getData(params.slug);

  if (!gallery) {
    return <div>Gallery not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/gallery"
        className="inline-flex items-center text-lg mb-8 hover:text-gray-600"
      >
        <ChevronLeft className="mr-2" /> Back to Galleries
      </Link>

      <h1 className="text-4xl font-bold text-center mb-12">{gallery.title}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {gallery.images.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-lg group"
          >
            <Image
              src={image.url}
              alt={image.alt || `Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const query = `*[_type == "gallery"]{
    "slug": slug.current
  }`;

  const slugs = await client.fetch(query);
  return slugs.map((slug) => ({
    slug: slug.slug,
  }));
}
