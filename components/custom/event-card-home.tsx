import React from "react";
import { Card } from "@/components/ui/card";
import { homeEventsCard } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

function isEventOver(eventDate: string): boolean {
  const currentDate = new Date();
  const eventDateTime = new Date(eventDate);
  return eventDateTime < currentDate;
}

async function getData() {
  const query = `*[_type == "upcomingEvent"]| order(date desc) [0..1] {
    title,
    image,
    description,
    date,
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function EventsHome() {
  const data: homeEventsCard[] = await getData();

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 z-0">
      <div className="grid grid-cols-1 gap-6">
        {data.map((post) => {
          const eventOver = isEventOver(post.date);
          return (
            <Card
              key={post.title}
              className={`overflow-hidden rounded-lg shadow-lg relative group ${
                eventOver ? "opacity-70" : ""
              }`}
            >
              <div className="relative w-full h-20 md:h-36 ">
                {post.image ? (
                  <Image
                    src={urlFor(post.image).url()}
                    alt={post.title}
                    width={600}
                    height={400}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <Image
                    src="/news-placeholder.webp"
                    alt="Placeholder"
                    width={600}
                    height={400}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent rounded-t-lg"></div>
                <h2
                  className={`absolute bottom-4 left-4 text-white font-semibold text-lg ${
                    eventOver ? "text-gray-300" : "text-white"
                  }`}
                >
                  {post.title}
                </h2>
              </div>
              {!eventOver && (
                <Link
                  href={`/upcoming-events/`}
                  className="absolute inset-0"
                  aria-label={`Read more about ${post.title}`}
                ></Link>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
