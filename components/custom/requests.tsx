"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Designation, District, VerificationStatus } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { changeTypeToText } from "@/lib/utils";
import { Input } from "../ui/input";
import SubmitButton from "./submit-button";
import { FormError } from "./form-error";
import { promotionSchema, transferSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type RequestType = "promotion" | "transfer";
interface RequestProps {
  requestStatus: VerificationStatus;
}
const Requests = ({ requestStatus }: RequestProps) => {
  const [open, setOpen] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>("promotion");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} disabled={requestStatus === "PENDING"}>
          {requestStatus === "PENDING"
            ? "Pending Request"
            : "Transfer/Promotion Request"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Transfer/Promotion Request
          </DialogTitle>
          <DialogDescription>
            <ul className="flex flex-col gap-1 text-start">
              <li>
                You can submit your transfer or promotion update for approval.
              </li>
              <li>You can only submit one request at a time.</li>
              <li>
                To submit another request, you must wait for the current request
                to be approved or rejected.
              </li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Label className="mt-1">Request Type</Label>
          <Select
            onValueChange={(value) => setRequestType(value as RequestType)}
            defaultValue={requestType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select request type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="promotion">Promotion</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
          {<RequestForm type={requestType} setOpen={setOpen} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Requests;

const RequestForm = ({
  type,
  setOpen,
}: {
  type: RequestType;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [error, setError] = useState("");
  const router = useRouter();
  const schema = type === "promotion" ? promotionSchema : transferSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setError("");
      const dataBody = {
        requestType: type === "promotion" ? "PROMOTION" : "TRANSFER",
        ...data,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/user/requests`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataBody),
        },
      );
      const responseData = await response.json();
      if (responseData.error) {
        setError(responseData.error);
      } else {
        toast.success("Request submitted successfully");
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      setError("Something went wrong. Try again later.");
      console.error(error);
    }
  };
  if (type === "transfer") {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="newWorkDistrict"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(District).map((district) => (
                      <SelectItem key={district} value={district}>
                        {changeTypeToText(district)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the district you want to transfer to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newOfficeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter office address" {...field} />
                </FormControl>
                <FormDescription>
                  Provide the address of the office you&apos;re transferring to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <SubmitButton
            title="Submit transfer request"
            isSubmitting={form.formState.isSubmitting}
          />
        </form>
      </Form>
    );
  } else {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 mx-auto"
        >
          <FormField
            control={form.control}
            name="newPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Position</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a new position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(Designation).map((position) => (
                      <SelectItem key={position} value={position}>
                        {changeTypeToText(position)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the position you have been promoted to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <SubmitButton
            title="Submit promotion request"
            isSubmitting={form.formState.isSubmitting}
          />
        </form>
      </Form>
    );
  }
};
