import { Image, PortableTextBlock } from "@sanity/types";

export interface homeEventsCard {
  title: string;
  description: string;
  currentSlug: string;
  content: PortableTextBlock[];
  image: Image;
  date: string;
}
