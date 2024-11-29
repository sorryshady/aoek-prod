// app/gallery/gallery-search.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GallerySearchProps {
  terms: string[];
}

export function GallerySearch({ terms }: GallerySearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag") || "";

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(currentTag);

  const handleSelect = (currentValue: string) => {
    // If selecting the same tag, clear the filter
    const newTag =
      currentValue.toLowerCase() === value.toLowerCase() ? "" : currentValue;

    // Create a new URL with or without tag parameter
    const params = new URLSearchParams(searchParams);
    if (newTag) {
      params.set("tag", newTag);
    } else {
      params.delete("tag");
    }

    // Navigate to the new URL
    router.push(`/gallery?${params.toString()}`);

    // Update local state
    setValue(newTag);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Filter by tag..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandEmpty>No tags found.</CommandEmpty>
          <CommandGroup>
            {terms.map((term) => (
              <CommandItem key={term} value={term} onSelect={handleSelect}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.toLowerCase() === term.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {term}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
