import { Image, PortableTextBlock } from "@sanity/types";

export type simpleNewsCard = {
  title: string;
  description: string;
  currentSlug: string;
  content: PortableTextBlock[];
  image: Image;
  date: string;
};
