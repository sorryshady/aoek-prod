import { Image, PortableTextBlock } from "@sanity/types";

export interface homeEventsCard {
  title: string;
  description: string;
  currentSlug: string;
  content: PortableTextBlock[];
  image: Image;
  date: string;
}
export interface upcomingEvent {
  title: string;
  description: string;
  image: Image;
  date: string;
}
