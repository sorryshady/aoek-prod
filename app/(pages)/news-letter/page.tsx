import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Wrapper from "@/components/custom/wrapper";
import { client } from "@/lib/sanity";
import { newsLetter } from "@/types/sanity-types";
import FileActions from "@/components/custom/file-actions";

async function getData() {
  const query = `*[_type == "downloads"] | order(date desc) {
    title,
    category,
    "fileUrl": file.asset->url,
    date,
  }`;
  const data = await client.fetch(query);
  return data;
}

export default async function NewsletterPage() {
  const newsletters: newsLetter[] = await getData();

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-[#464A66] to-[#2E6589] py-32 px-4">
      <div className="absolute inset-0 bg-cover bg-body_img opacity-30 bg-top z-0"></div>
      <Wrapper>
        <h1 className="mb-12 text-center text-3xl font-semibold text-white relative z-10">
          Newsletter
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
          {newsletters.map((newsletter, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="flex items-center justify-center p-6">
                <Image
                  src="/abridge.webp"
                  alt="Abridge Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </CardHeader>
              <CardContent className="text-center">
                <h2 className="text-lg font-medium">{newsletter.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(newsletter.date).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </CardContent>

              <FileActions
                fileUrl={newsletter.fileUrl}
                title={newsletter.title}
              />
            </Card>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}