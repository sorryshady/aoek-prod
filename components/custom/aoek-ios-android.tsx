import React from "react";
import { Button } from "@/components/ui/button"; // Assuming ShadCN button is set up
import Image from "next/image";
import Link from "next/link";

export default function AoekBanner() {
  return (
    <section className="bg-gray-50 py-16 h-screen">
      <div className="container mx-auto px-6 text-center">
        {/* Title Section */}
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-6">
          AOEK is now also available on Android & iOS
        </h2>

        {/* Images Section */}
        <div className="flex justify-center items-center space-x-6 mb-10">
          <Image
            src="/imageslider_1.webp"
            alt="android-icon"
            width={100}
            height={100}
          />
        </div>

        {/* Buttons Section */}
        <div className="flex justify-center space-x-4">
          <Link
            href={"https://play.google.com/store/apps/details?id=com.aoek.app"}
          >
            <Button
              variant="default"
              className="bg-red-500 text-white px-6 py-2"
            >
              For Android
            </Button>
          </Link>
          <Link href={"https://apps.apple.com/in/app/aoek/id1601234510"}>
            <Button
              variant="default"
              className="bg-red-500 text-white px-6 py-2"
            >
              For iOS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
