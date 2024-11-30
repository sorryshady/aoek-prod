import { client } from "@/lib/sanity";
import GalleryCarousel from "./carousel";

export interface Imagedata {
  title: string;
  src: string;
  alt: string;
  slug: string;
}

export interface GetImage {
  currentSlug: string;
  title: string;
  firstImage: {
    url: string;
    alt: string;
  };
}

async function getData() {
  try {
    const query = `*[_type == "gallery"]| order(_createdAt desc) {
      title,
      "currentSlug": slug.current,
      "firstImage": images[0]{
        "url": asset->url,
        alt
      }
    }`;

    const images: GetImage[] = await client.fetch(query);

    return images.map((image) => ({
      title: image.title,
      src: image.firstImage?.url || "",
      alt: image.firstImage?.alt || "",
      slug: image.currentSlug,
    }));
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const data = await getData();
  return (
    <div className="relative  py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#5386A4]/100 to-[#1F333E]/100 z-0 h-screen" />
      <div className="absolute inset-0 bg-cover bg-hero_img opacity-30 bg-top z-0" />
      <GalleryCarousel images={data} />
    </div>
  );
}
