"use client";
import Link from "next/link";
import React, { useState } from "react";
import LogoutButton from "./logout-button";
import { LogOut } from "lucide-react";
import { SessionUser } from "@/types";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface UserNavProps {
  user: SessionUser;
}
const UserNav = ({ user }: UserNavProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="cursor-pointer">
        <Avatar className="w-12 h-12 cursor-pointer">
          <AvatarImage src={user.photoUrl || ""} />
          <AvatarFallback className="bg-black text-white">
            {user.name[0] + user.name[1]}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-60 z-[1000] mr-4">
        <div className="flex flex-col gap-5">
          <Button
            variant={"ghost"}
            onClick={() => {
              router.push("/account");
              setOpen(false);
            }}
          >
            Account
          </Button>
          {user.userRole !== "ADMIN" && (
            <Button
              variant={"ghost"}
              onClick={() => {
                router.push("/admin");
                setOpen(false);
              }}
            >
              Admin
            </Button>
          )}
          <LogoutButton className="w-full">
            <LogOut />
          </LogoutButton>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserNav;
