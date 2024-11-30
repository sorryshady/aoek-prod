import { client } from "@/lib/sanity";
import GalleryCarousel from "./carousel";
import Wrapper from "@/components/custom/wrapper";

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
    <div className="relative min-h-screen py-24">
      <div className="absolute inset-0 bg-cover bg-hero_img opacity-90 bg-top z-0" />
      {/* <Wrapper className="relative z-20"> */}
      <GalleryCarousel images={data} />
      {/* </Wrapper> */}
    </div>
  );
}
