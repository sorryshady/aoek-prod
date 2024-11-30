import Wrapper from "@/components/custom/wrapper";
import { upcomingEvent } from "@/lib/interface";
import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

function isEventOver(eventDate: string): boolean {
  const currentDate = new Date();
  const eventDateTime = new Date(eventDate);
  return eventDateTime < currentDate;
}

async function getData() {
  const currentDate = new Date();
  const pastMonthDate = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1),
  );

  const query = `*[_type == "upcomingEvent" && date >= $pastMonthDate] | order(date desc) {
      title,
      image,
      description,
      date,
      venue
    }`;

  const data = await client.fetch(query, { pastMonthDate });
  return data;
}

export default async function UpcomingEventsPage() {
  const events: upcomingEvent[] = await getData();
  const upcomingEvents = events.filter((event) => !isEventOver(event.date));
  const pastEvents = events
    .filter((event) => isEventOver(event.date))
    .slice(0, 4);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-[#464A66] to-[#2E6589] py-24">
      <div className="absolute inset-0 bg-cover bg-body_img opacity-30 bg-top z-0"></div>
      <Wrapper className="relative z-20">
        {/* Upcoming Events Section */}
        <section className="mb-16">
          <h2 className="text-4xl font-bold text-center text-white mb-8">
            Upcoming Events
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} event={event} />
            ))}
          </div>
        </section>

        {/* Past Events Section */}
        <section>
          <h2 className="text-4xl font-bold text-center text-white mb-8">
            Past Events
          </h2>
          <div className="grid grid-cols-2 gap-5">
            {pastEvents.map((event, index) => (
              <EventCard key={index} event={event} isPast />
            ))}
          </div>
        </section>
      </Wrapper>
    </div>
  );
}

interface EventCardProps {
  event: upcomingEvent;
  isPast?: boolean;
}

const EventCard = ({ event, isPast = false }: EventCardProps) => {
  return (
    <Card
      className={`w-full min-h-60 overflow-hidden transition-all duration-300 ${
        isPast ? "opacity-90" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-72 h-64 md:h-auto">
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
              width={900}
              height={900}
            />
            {isPast && (
              <div className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 text-sm font-semibold rounded">
                Past Event
              </div>
            )}
          </div>
          <div className="flex-1 p-6">
            <h3 className={`text-2xl font-bold mb-4`}>{event.title}</h3>
            <div className="space-y-4">
              <div
                className={`flex items-center ${isPast ? "" : "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <time dateTime={event.date}>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className={`mt-4 line-clamp-3 `}>{event.description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
