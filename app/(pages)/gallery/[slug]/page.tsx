// import Wrapper from "@/components/custom/wrapper";
// import { GalleryData } from "@/types/sanity-types";
// import { client, urlFor } from "@/lib/sanity";
// import Image from "next/image";

// type Params = Promise<{ slug: string }>;

// async function getData(slug: string) {
//   const query = `*[_type == "gallery" && slug.current == "${slug}"] {
//     title,
//     images,
//     "currentSlug": slug.current
//   }[0]`;
//   const data = await client.fetch(query);
//   return data;
// }

// export default async function GalleryPage({ params }: { params: Params }) {
//   const { slug } = await params;
//   const data: GalleryData = await getData(slug);

//   return (
//     <Wrapper>
//       <div className="max-w-7xl mx-auto py-8 px-4">
//         <h1 className="text-3xl font-bold text-center mb-8">{data.title}</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {data.images &&
//             data.images.map((image, index) => (
//               <div
//                 key={index}
//                 className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
//               >
//                 <Image
//                   src={urlFor(image).url()}
//                   alt={`Gallery image ${index + 1}`}
//                   fill
//                   className="object-cover hover:scale-105 transition-transform duration-300"
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   priority={index < 6}
//                 />
//               </div>
//             ))}
//         </div>
//       </div>
//     </Wrapper>
//   );
// }

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";

// Sample image data
const images = [
  {
    id: 1,
    src: "/abridge.png",
    title: "Major Projects by AOEK Engineers",
    alt: "Road construction project",
  },
  {
    id: 2,
    src: "/aoek-logo.png",
    title: "Bridge Illumination Project",
    alt: "Bridge at night",
  },
  {
    id: 3,
    src: "/logo.png",
    title: "Community Events",
    alt: "Community gathering",
  },
  {
    id: 4,
    src: "/news-placeholder.webp",
    title: "Infrastructure Development",
    alt: "Infrastructure project",
  },
];

export default function GalleryCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter images based on search query
  const filteredImages = images.filter((image) =>
    image.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // No images found placeholder
  if (filteredImages.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>

        <div className="relative bg-slate-900 rounded-lg p-8 text-center">
          <p className="text-white text-xl mb-4">No images found</p>

          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search for section"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>

      <div className="relative bg-slate-900 rounded-lg p-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* Previous Image Preview */}
          {getPreviousImage() && (
            <div className="relative w-32 h-24 opacity-50">
              <Image
                src={getPreviousImage().src}
                alt={getPreviousImage().alt}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          {/* Main Image */}
          <div className="relative w-full h-[400px]">
            <Image
              src={filteredImages[safeCurrentIndex].src}
              alt={filteredImages[safeCurrentIndex].alt}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Next Image Preview */}
          {getNextImage() && (
            <div className="relative w-32 h-24 opacity-50">
              <Image
                src={getNextImage().src}
                alt={getNextImage().alt}
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

        {/* Search Box */}
        <div className="relative max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Search for section"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight, Check } from "lucide-react";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// // Ensure images is always an array
// const images = [
//   {
//     id: 1,
//     src: "/abridge.png",
//     title: "Major Projects by AOEK Engineers",
//     alt: "Road construction project",
//   },
//   {
//     id: 2,
//     src: "/aoek-logo.png",
//     title: "Bridge Illumination Project",
//     alt: "Bridge at night",
//   },
//   {
//     id: 3,
//     src: "/logo.png",
//     title: "Community Events",
//     alt: "Community gathering",
//   },
//   {
//     id: 4,
//     src: "/news-placeholder.webp",
//     title: "Infrastructure Development",
//     alt: "Infrastructure project",
//   },
// ]; // Fallback to empty array if undefined

// export default function GalleryCarousel() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState("");

//   // Defensive filtering with fallback
//   const filteredImages = (images || []).filter(
//     (image) =>
//       image &&
//       image.title &&
//       image.title.toLowerCase().includes((value || "").toLowerCase())
//   );

//   // Safe index calculation
//   const safeCurrentIndex = Math.min(
//     currentIndex,
//     Math.max(0, filteredImages.length - 1)
//   );

//   const goToPrevious = () => {
//     setCurrentIndex((current) =>
//       current === 0 ? filteredImages.length - 1 : current - 1
//     );
//   };

//   const goToNext = () => {
//     setCurrentIndex((current) =>
//       current === filteredImages.length - 1 ? 0 : current + 1
//     );
//   };

//   // Null-safe image preview getters
//   const getPreviousImage = () => {
//     if (!filteredImages.length) return null;
//     const prevIndex =
//       safeCurrentIndex === 0 ? filteredImages.length - 1 : safeCurrentIndex - 1;
//     return filteredImages[prevIndex] || null;
//   };

//   const getNextImage = () => {
//     if (!filteredImages.length) return null;
//     const nextIndex =
//       safeCurrentIndex === filteredImages.length - 1 ? 0 : safeCurrentIndex + 1;
//     return filteredImages[nextIndex] || null;
//   };

//   // No images found placeholder
//   if (!filteredImages.length) {
//     return (
//       <div className="w-full max-w-5xl mx-auto p-6">
//         <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>

//         <div className="relative bg-slate-900 rounded-lg p-8 text-center">
//           <p className="text-white text-xl mb-4">No images found</p>

//           <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 role="combobox"
//                 aria-expanded={open}
//                 className="w-[200px] justify-between"
//               >
//                 {value
//                   ? (images || []).find(
//                       (image) =>
//                         image &&
//                         image.title &&
//                         image.title.toLowerCase() === value.toLowerCase()
//                     )?.title || "Select image..."
//                   : "Select image..."}
//                 <ChevronLeft className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-[200px] p-0">
//               <Command>
//                 <CommandInput placeholder="Search image..." />
//                 <CommandEmpty>No image found.</CommandEmpty>
//                 <CommandGroup>
//                   {(images || []).map(
//                     (image) =>
//                       image && (
//                         <CommandItem
//                           key={image.id}
//                           value={image.title}
//                           onSelect={(currentValue) => {
//                             setValue(
//                               currentValue === value ? "" : currentValue
//                             );
//                             setOpen(false);
//                           }}
//                         >
//                           <Check
//                             className={cn(
//                               "mr-2 h-4 w-4",
//                               value.toLowerCase() === image.title.toLowerCase()
//                                 ? "opacity-100"
//                                 : "opacity-0"
//                             )}
//                           />
//                           {image.title}
//                         </CommandItem>
//                       )
//                   )}
//                 </CommandGroup>
//               </Command>
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-5xl mx-auto p-6">
//       <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>

//       <div className="relative bg-slate-900 rounded-lg p-8">
//         <div className="flex items-center justify-center gap-4 mb-8">
//           {/* Previous Image Preview */}
//           {getPreviousImage() && (
//             <div className="relative w-32 h-24 opacity-50">
//               <Image
//                 src={getPreviousImage().src}
//                 alt={getPreviousImage().alt}
//                 fill
//                 className="object-cover rounded-lg"
//               />
//             </div>
//           )}

//           {/* Main Image */}
//           <div className="relative w-full h-[400px]">
//             <Image
//               src={filteredImages[safeCurrentIndex].src}
//               alt={filteredImages[safeCurrentIndex].alt}
//               fill
//               className="object-cover rounded-lg"
//             />
//           </div>

//           {/* Next Image Preview */}
//           {getNextImage() && (
//             <div className="relative w-32 h-24 opacity-50">
//               <Image
//                 src={getNextImage().src}
//                 alt={getNextImage().alt}
//                 fill
//                 className="object-cover rounded-lg"
//               />
//             </div>
//           )}
//         </div>

//         {/* Navigation Buttons */}
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
//           onClick={goToPrevious}
//         >
//           <ChevronLeft className="h-8 w-8" />
//         </Button>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
//           onClick={goToNext}
//         >
//           <ChevronRight className="h-8 w-8" />
//         </Button>

//         {/* Title */}
//         <h2 className="text-2xl font-semibold text-center text-white mb-4">
//           {filteredImages[safeCurrentIndex].title}
//         </h2>

//         {/* Combobox */}
//         <div className="relative max-w-md mx-auto">
//           <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 role="combobox"
//                 aria-expanded={open}
//                 className="w-full justify-between"
//               >
//                 {value
//                   ? (images || []).find(
//                       (image) =>
//                         image &&
//                         image.title &&
//                         image.title.toLowerCase() === value.toLowerCase()
//                     )?.title || "Select image..."
//                   : "Select image..."}
//                 <ChevronLeft className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-full p-0">
//               <Command>
//                 <CommandInput placeholder="Search image..." />
//                 <CommandEmpty>No image found.</CommandEmpty>
//                 <CommandGroup>
//                   {(images || []).map(
//                     (image) =>
//                       image && (
//                         <CommandItem
//                           key={image.id}
//                           value={image.title}
//                           onSelect={(currentValue) => {
//                             setValue(
//                               currentValue === value ? "" : currentValue
//                             );
//                             setOpen(false);
//                             setCurrentIndex(
//                               (images || []).findIndex(
//                                 (img) =>
//                                   img &&
//                                   img.title &&
//                                   img.title.toLowerCase() ===
//                                     currentValue.toLowerCase()
//                               )
//                             );
//                           }}
//                         >
//                           <Check
//                             className={cn(
//                               "mr-2 h-4 w-4",
//                               value.toLowerCase() === image.title.toLowerCase()
//                                 ? "opacity-100"
//                                 : "opacity-0"
//                             )}
//                           />
//                           {image.title}
//                         </CommandItem>
//                       )
//                   )}
//                 </CommandGroup>
//               </Command>
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>
//     </div>
//   );
// }
