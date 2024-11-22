"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { AuthStage, SessionUser } from "@/types/session-types";
import ActiveLinks from "./active-links";
import { useAuth } from "@/app/providers/auth-context";
import UserNav from "./user-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useState } from "react";
import { LogOut, MenuIcon } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import LogoutButton from "./logout-button";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, authStage } = useAuth();

  return (
    <div className="w-full bg-[#35718E] fixed top-0 left-0 right-0 z-[999]">
      <DesktopNavbar user={user!} authStage={authStage} />
      <MobileNavbar user={user!} authStage={authStage} />
    </div>
  );
};

export default Navbar;

const DesktopNavbar = ({
  user,
  authStage,
}: {
  user: SessionUser;
  authStage: AuthStage;
}) => {
  return (
    <nav className="hidden lg:flex justify-between items-center max-w-7xl mx-auto p-4">
      <Link href="/" className="flex items-center gap-3 flex-1">
        <Image src="/logo.png" alt="logo" width={60} height={60} />
        <span className="text-2xl font-bold text-white tracking-wider">
          AOEK
        </span>
      </Link>
      <ul className="flex items-center flex-[1.5] justify-around text-white text-base font-medium">
        <li>
          <ActiveLinks title="Home" href="/" />
        </li>
        <li>
          <ActiveLinks title="Committee" href="/committee" />
        </li>
        <li>
          <ActiveLinks title="News" href="/news" />
        </li>
        <li>
          <ActiveLinks title="Events" href="/events" />
        </li>
        <li>
          <ActiveLinks title="Gallery" href="/gallery" />
        </li>
        <li>
          <ActiveLinks title="Newsletter" href={"/newsletter"} />
        </li>
        <li>
          <ActiveLinks title="Updates" href="/updates" />
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
            <UserNav user={user} />
          )}
        </li>
      </ul>
    </nav>
  );
};

const MobileNavbar = ({
  user,
  authStage,
}: {
  user: SessionUser;
  authStage: AuthStage;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleLinkClick = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };
  return (
    <nav className="lg:hidden flex justify-between items-center max-w-7xl mx-auto p-4">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="logo" width={60} height={60} />
        <span className="text-2xl font-bold text-white tracking-wider">
          AOEK
        </span>
      </Link>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="bg-[#35718E]">
            <MenuIcon className="text-white" size={48} />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[300px] sm:w-[400px] pt-10 bg-[#35718E] border-none text-white overflow-auto z-[1000]"
        >
          <SheetHeader>
            <SheetTitle className="text-left w-full text-white mt-10 px-4 border-b-2">
              Menu
            </SheetTitle>
            <Separator />
          </SheetHeader>
          <ul className="mt-10 flex flex-col gap-10 p-4 text-start text-white text-base font-medium">
            <li>
              <ActiveLinks onClick={handleLinkClick} title="Home" href="/" />
            </li>
            <li>
              <ActiveLinks
                onClick={handleLinkClick}
                title="Committee"
                href="/committee"
              />
            </li>
            <li>
              <ActiveLinks
                onClick={handleLinkClick}
                title="News"
                href="/news"
              />
            </li>
            <li>
              <ActiveLinks
                onClick={handleLinkClick}
                title="Events"
                href="/events"
              />
            </li>
            <li>
              <ActiveLinks
                onClick={handleLinkClick}
                title="Gallery"
                href="/gallery"
              />
            </li>
            <li>
              <ActiveLinks
                onClick={handleLinkClick}
                title="Newsletter"
                href={"/newsletter"}
              />
            </li>
            <li>
              <ActiveLinks
                onClick={handleLinkClick}
                title="Updates"
                href="/updates"
              />
            </li>
            <li>
              {authStage !== AuthStage.AUTHENTICATED && (
                <Button
                  asChild
                  className="py-2 px-12 font-semibold shadow-md w-full"
                  variant={"destructive"}
                >
                  <Link href={"/login"} onClick={handleLinkClick}>
                    Login
                  </Link>
                </Button>
              )}
              {user && authStage === AuthStage.AUTHENTICATED && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 text-base text-white font-medium data-[state=open]:text-white">
                      Welcome, {user.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-5 bg-white rounded-md p-4">
                        <Button
                          variant={"ghost"}
                          className="text-black"
                          onClick={() => {
                            router.push("/account");
                            setIsOpen(false);
                          }}
                        >
                          Account
                        </Button>
                        {user.userRole !== "ADMIN" && (
                          <Button
                            variant={"ghost"}
                            className="text-black"
                            onClick={() => {
                              router.push("/admin");
                              setIsOpen(false);
                            }}
                          >
                            Admin
                          </Button>
                        )}
                        <LogoutButton
                          handleClick={handleLinkClick}
                          className="w-full"
                        >
                          <LogOut />
                        </LogoutButton>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </li>
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
