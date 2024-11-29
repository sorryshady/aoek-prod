"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Wrapper from "@/components/custom/wrapper";
import { Imagedata } from "./page";

interface GalleryCarouselProps {
  images: Imagedata[];
}

export default function GalleryCarousel({ images }: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [value, setValue] = useState("");

  // Filter images based on selected value
  const filteredImages =
    value && images.length > 0
      ? images.filter(
          (image) => image.title.toLowerCase() === value.toLowerCase()
        )
      : images;

  // Reset currentIndex if it becomes invalid after filtering
  const safeCurrentIndex =
    currentIndex >= filteredImages.length ? 0 : currentIndex;

  const goToPrevious = () => {
    setCurrentIndex((current) =>
      current === 0 ? filteredImages.length - 1 : current - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((current) =>
      current === filteredImages.length - 1 ? 0 : current + 1
    );
  };

  // Get previous and next images for preview with null checks
  const getPreviousImage = () => {
    if (filteredImages.length === 0) return null;
    const prevIndex =
      safeCurrentIndex === 0 ? filteredImages.length - 1 : safeCurrentIndex - 1;
    return filteredImages[prevIndex];
  };

  const getNextImage = () => {
    if (filteredImages.length === 0) return null;
    const nextIndex =
      safeCurrentIndex === filteredImages.length - 1 ? 0 : safeCurrentIndex + 1;
    return filteredImages[nextIndex];
  };

  // Loading state
  if (images.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>
        <div className="relative bg-slate-900 rounded-lg p-8 text-center">
          <p className="text-white text-xl mb-4">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-hero_img inset-0 bg-cover overflow-hidden">
      <Wrapper className="my-[5rem]">
        <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>

        <div className="relative bg-slate-900 rounded-lg p-8">
          {filteredImages.length > 0 ? (
            <>
              <div className="flex items-center justify-center gap-4 mb-8">
                {/* Previous Image Preview */}
                {getPreviousImage() && (
                  <div className="relative w-32 h-24 opacity-50">
                    <Image
                      src={getPreviousImage()?.src || ""}
                      alt={getPreviousImage()?.alt || ""}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Main Image */}
                <Link
                  href={`/gallery/${filteredImages[safeCurrentIndex].slug}`}
                  className="relative w-full h-[400px] block"
                >
                  <Image
                    src={filteredImages[safeCurrentIndex].src}
                    alt={filteredImages[safeCurrentIndex].alt}
                    fill
                    className="object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>

                {/* Next Image Preview */}
                {getNextImage() && (
                  <div className="relative w-32 h-24 opacity-50">
                    <Image
                      src={getNextImage()?.src || ""}
                      alt={getNextImage()?.alt || ""}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-center text-white mb-4">
                {filteredImages[safeCurrentIndex].title}
              </h2>
            </>
          ) : (
            <p className="text-white text-xl mb-4 text-center">
              No images found
            </p>
          )}
        </div>
      </Wrapper>
    </div>
  );
}
