import { client } from "@/lib/sanity";
import { gallery } from "@/types/sanity-types";

async function getData() {
  const query = `*[_type == "gallery"] | order(date desc) {
    title,
    category,
    "fileUrl": file.asset->url,
    date,
  }`;
  const data = await client.fetch(query);
  return data;
}
export default async function Gallery() {
  const gallery: gallery[] = await getData();
  console.log(gallery);
  return <div className="min-h-screen bg-gray-500">Gallery</div>;
}
