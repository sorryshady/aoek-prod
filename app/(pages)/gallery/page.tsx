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

export default async function fetchGalleryImages(): Promise<Imagedata[]> {
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
