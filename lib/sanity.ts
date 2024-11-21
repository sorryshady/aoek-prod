import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import { Image } from "@sanity/types";
export const client = createClient({
  apiVersion: "2023-05-03",
  dataset: "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: Image) {
  return builder.image(source);
}
