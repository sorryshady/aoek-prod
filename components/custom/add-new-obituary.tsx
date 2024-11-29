"use client";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import SubmitButton from "./submit-button";
import { UserStatus } from "@prisma/client";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import {
  obituarySchema,
  ObituarySchema,
} from "@/schemas/admin-obituary-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import CustomDate from "./custom-date";
import { FormError } from "./form-error";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { changeTypeToText } from "@/lib/utils";
import { queryClient } from "@/app/providers/query-client";

interface Search {
  id: string;
  membershipId: number;
  name: string;
  email: string;
  userStatus: UserStatus;
}
const AddNewObituary = () => {
  const [searching, setSearching] = useState(false);
  const [value, setValue] = useState<string>("");
  const [users, setUsers] = useState<Search[]>([]);
  const [selectedUser, setSelectedUser] = useState<Search | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Obituary form setup
  const form = useForm<ObituarySchema>({
    resolver: zodResolver(obituarySchema),
    defaultValues: {
      dateOfDeath: "",
      additionalNote: "",
    },
  });
  const handleSearch = async () => {
    try {
      setSearching(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: value }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to search users");
      }
      const data = await response.json();
      setValue("");
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };
  // Obituary submission handler
  const onSubmitObituary = async (data: ObituarySchema) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/admin/obituaries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            membershipId: selectedUser.membershipId,
            additionalNote: data.additionalNote,
            dateOfDeath: data.dateOfDeath,
          }),
        },
      );

      const responseData = await response.json();
      if (responseData.error) {
        setError(responseData.error);
      } else {
        queryClient.invalidateQueries({ queryKey: ["admin", "obituaries"] });
        toast.success("Obituary added successfully");
        router.refresh();
        // Reset states
        setIsDialogOpen(false);
        setSelectedUser(null);
        setUsers([]);
        form.reset();
      }
    } catch (error) {
      setError("Failed to add obituary");
      console.error(error);
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Add new obituary</h2>
      <div className="flex flex-col gap-3">
        <Label className="text-nowrap">Find User</Label>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Enter name, email or membership id"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-[300px]"
          />
          <SubmitButton
            title="Search"
            isSubmitting={searching}
            onClick={handleSearch}
          />
        </div>
      </div>

      {/* Search Results */}
      {users.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results</h3>
          <Separator />
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">
                    Membership ID: {user.membershipId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {changeTypeToText(user.userStatus)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDialogOpen(true);
                  }}
                >
                  Select for Obituary
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Obituary Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Obituary for {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Please provide details for the obituary.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitObituary)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="dateOfDeath"
                render={() => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Death</FormLabel>
                    <CustomDate control={form.control} name="dateOfDeath" />
                    <FormDescription>Provide date of death</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Comments</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter additional comments"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <SubmitButton
                title="Submit Obituary"
                isSubmitting={form.formState.isSubmitting}
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewObituary;
