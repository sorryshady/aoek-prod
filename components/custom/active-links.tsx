"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ActiveLinkProps extends LinkProps {
  title: string;
}
const ActiveLinks = ({ title, href }: ActiveLinkProps) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        { "font-semibold underline": pathname === href },
        "hover:text-gray-200",
      )}
    >
      {title}
    </Link>
  );
};

export default ActiveLinks;
