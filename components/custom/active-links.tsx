"use client";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ActiveLinkProps extends LinkProps {
  title: string;
}
const ActiveLinks = ({ title, href, onClick }: ActiveLinkProps) => {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        { "font-semibold underline text-[#FACE30]": pathname === href },
        "hover:text-[#FACE30]",
      )}
    >
      {title}
    </Link>
  );
};

export default ActiveLinks;
