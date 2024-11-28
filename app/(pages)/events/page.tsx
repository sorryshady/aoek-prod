import Wrapper from "@/components/custom/wrapper";
import { upcomingEvent } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

function isEventOver(eventDate: string): boolean {
  const currentDate = new Date();
  const eventDateTime = new Date(eventDate);
  return eventDateTime < currentDate;
}

async function getData() {
  const query = `*[_type == "upcomingEvent"] | order(date desc) {
    title,
    image,
    description,
    date,
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function UpcomingEventsPage() {
  const events: upcomingEvent[] = await getData();

  return (
    <Wrapper className=" my-[5rem] space-y-5">
      <h1 className="text-4xl font-bold text-center my-8">Events</h1>
      <div className="grid gap-8 lg:grid-cols-1 grid-cols-1">
        {events.map((event, index) => {
          const eventOver = isEventOver(event.date);
          return (
            <Card
              key={index}
              className={`w-full mx-auto transition-opacity duration-300 ${eventOver ? "opacity-60" : ""}`} //min width doubt
            >
              <CardHeader>
                <h2
                  className={`text-2xl font-bold text-center mb-4 ${eventOver ? "text-gray-500" : ""}`}
                >
                  {event.title}
                </h2>
                <div
                  className={`flex items-center justify-center text-sm mb-4 ${eventOver ? "text-gray-400" : "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <time dateTime={event.date}>
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-64 mb-6">
                  <Image
                    src={
                      event.image
                        ? urlFor(event.image).url()
                        : "/news-placeholder.webp"
                    }
                    alt={
                      event.image
                        ? `Image for ${event.title}`
                        : `Placeholder image for ${event.title}`
                    }
                    fill
                    className={`object-cover rounded-md ${eventOver ? "grayscale" : ""}`}
                  />
                  {eventOver && (
                    <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 text-sm font-semibold rounded">
                      Past Event
                    </div>
                  )}
                </div>
                <p
                  className={`text-center mb-4 ${eventOver ? "text-gray-500" : ""}`}
                >
                  {event.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Wrapper>
  );
}
