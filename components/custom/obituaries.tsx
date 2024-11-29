"use client";
import { Obituary, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import SubmitButton from "./submit-button";
import { Loader2 } from "lucide-react";

type ObituarieResponse = Obituary & {
  user: User;
};
const Obituaries = () => {
  const [obituaries, setObituaries] = useState<ObituarieResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
//   const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          "/api/admin/obituaries?includeExpired=true",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch obituaries");
        }
        const data = await response.json();
        console.log(data);
        setObituaries(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch obituaries");
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="py-4">
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading...
        </div>
      ) : obituaries.length > 0 ? (
        <div>Data</div>
      ) : (
        <div className="flex justify-center items-center h-24 text-muted-foreground">
          No obituaries found.
        </div>
      )}
    </div>
  );
};

export default Obituaries;

{
  /* <div className="flex flex-col gap-3">
        <Label className="text-nowrap">Find User</Label>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Enter name, email or membership id"
            className="w-[300px]"
          />
          <SubmitButton title="Search" isSubmitting={searching} />
        </div>
      </div> */
}
