"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { AuthStage, useAuth } from "@/app/providers/auth-context";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { user, authStage } = useAuth();
  const pathname = usePathname();
  return (
    <div className="w-full bg-[#35718E] fixed top-0 left-0 right-0">
      <nav className="flex justify-between items-center max-w-7xl mx-auto p-4">
        <Link href="/" className="flex items-center gap-3 flex-1">
          <Image src="/logo.png" alt="logo" width={60} height={60} />
          <span className="text-2xl font-bold text-white tracking-wider">
            AOEK
          </span>
        </Link>
        <ul className="flex items-center flex-[1.5] justify-around text-white text-base font-medium">
          <li>
            <Link
              href={"/"}
              className={cn(
                { "font-semibold underline": pathname === "/" },
                "hover:text-gray-200",
              )}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href={"/committee"}
              className={cn(
                { "font-semibold underline": pathname.includes("/committee") },
                "hover:text-gray-200",
              )}
            >
              Committee
            </Link>
          </li>
          <li>
            <Link
              href={"/news"}
              className={cn(
                { "font-semibold underline": pathname.includes("/news") },
                "hover:text-gray-200",
              )}
            >
              News
            </Link>
          </li>
          <li>
            <Link
              href={"/events"}
              className={cn(
                { "font-semibold underline": pathname === "/events" },
                "hover:text-gray-200",
              )}
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              href={"/gallery"}
              className={cn(
                { "font-semibold underline": pathname.includes("/gallery") },
                "hover:text-gray-200",
              )}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              href={"/news-letter"}
              className={cn(
                { "font-semibold underline": pathname === "/news-letter" },
                "hover:text-gray-200",
              )}
            >
              Newsletter
            </Link>
          </li>
          <li>
            <Link
              href={"/updates"}
              className={cn(
                { "font-semibold underline": pathname.includes("/updates") },
                "hover:text-gray-200",
              )}
            >
              Updates
            </Link>
          </li>
          <li>
            {authStage !== AuthStage.AUTHENTICATED && (
              <Button
                asChild
                className="py-2 px-12 font-semibold shadow-md"
                variant={"destructive"}
              >
                <Link href={"/login"}>Login</Link>
              </Button>
            )}
            {user && authStage === AuthStage.AUTHENTICATED && (
              <Link href={"/account"} className="font-semibold text-base">
                Welcome, {user.name}
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
