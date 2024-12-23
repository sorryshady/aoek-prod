import { File, Image, PortableTextBlock } from "@sanity/types";

export type simpleNewsCard = {
  title: string;
  description: string;
  currentSlug: string;
  content: PortableTextBlock[];
  image: Image;
  date: string;
};
export type newsLetter = {
  title: string;
  category: string;
  fileUrl: string;
  date: string;
};
export interface GalleryData {
  title: string;
  images: any[];
  currentSlug: string;
}
