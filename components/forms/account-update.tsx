/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { SessionUser } from "@/types";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import {
  updateProfileSchema,
  UpdateProfileSchema,
} from "@/schemas/update-profile-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "../ui/form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState, useMemo } from "react";

import { Button } from "../ui/button";
import { District } from "@prisma/client";
import { Input } from "../ui/input";
import SubmitButton from "../custom/submit-button";
import { Edit } from "lucide-react";
import { FormError } from "../custom/form-error";
import { useRouter } from "next/navigation";
import { changeTypeToText } from "@/lib/utils";

export const AccountUpdate = ({ user }: { user: SessionUser }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);

  const initialData = useMemo(
    () => ({
      personalAddress: user.personalAddress,
      homeDistrict: user.homeDistrict,
      phoneNumber: user.phoneNumber ? user.phoneNumber : undefined,
      mobileNumber: user.mobileNumber,
    }),
    [user],
  );

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: initialData,
  });
  const { reset } = form;

  const onSubmit = async (values: UpdateProfileSchema) => {
    try {
      setIsSubmitting(true);
      const hasChanges = Object.keys(initialData).some(
        (key) =>
          initialData[key as keyof UpdateProfileSchema] !==
          values[key as keyof UpdateProfileSchema],
      );
      if (!hasChanges) {
        setError("");
        toast.error("No changes made");
        return;
      }

      const submissionData = {
        ...values,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/user`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            membershipId: user.membershipId,
            ...submissionData,
          }),
        },
      );
      const data = await response.json();

      if (data.error) {
        console.error("error encountered");
        throw new Error(data.error);
      }

      reset(values);
      toast.success("Profile updated successfully");
      setEdit(false);
      setError("");
      router.refresh();
    } catch (error) {
      setError("An error occurred while submitting the form");
      reset(initialData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative">
        {edit ? (
          <Form {...form}>
            <form className="space-y-10" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Permanent Address</h2>
                <div className="grid grid-cols-2 capitalize gap-5">
                  <div>Permanent Address</div>
                  <FormField //permenant address
                    control={form.control}
                    // disabled={isSubmitting}
                    name="personalAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter permanent address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>Home District</div>
                  <FormField //homeDistrict
                    control={form.control}
                    // disabled={isSubmitting}
                    name="homeDistrict"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(District).map((item) => (
                              <SelectItem key={item} value={item}>
                                <span className="capitalize">
                                  {changeTypeToText(item)}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Contact Info</h2>
                <div className="grid grid-cols-2 capitalize gap-5">
                  <div>Email</div>
                  <div className="lowercase w-full overflow-hidden text-ellipsis">
                    {user.email}
                  </div>
                  <div>Phone Number</div>
                  <FormField //office address
                    control={form.control}
                    // disabled={isSubmitting}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>Mobile Number</div>
                  <FormField //office address
                    control={form.control}
                    // disabled={isSubmitting}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-5">
                <h2 className="text-xl font-bold">Other Information</h2>
                <div className="grid grid-cols-2 capitalize gap-5">
                  <div>Committee Member</div>
                  <div>{changeTypeToText(user.committeeType)}</div>
                  <div>Committee Position</div>
                  <div>
                    {changeTypeToText(
                      user.positionState || user.positionDistrict || "-",
                    )}
                  </div>
                </div>
              </div>
              <FormError message={error} />
              <div className="flex w-full gap-5 mt-10">
                <SubmitButton
                  title="Update details"
                  isSubmitting={isSubmitting}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    reset(initialData);
                    setEdit(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-10">
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Permanent Address</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Permanent Address</div>
                <div>{user.personalAddress}</div>
                <div>Home District</div>
                <div>{changeTypeToText(user.homeDistrict)}</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Contact Info</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Email</div>
                <div className="lowercase w-full overflow-hidden text-ellipsis">
                  {user.email}
                </div>
                <div>Phone Number</div>
                <div>{user.phoneNumber || "-"}</div>
                <div>Mobile Number</div>
                <div>{user.mobileNumber}</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Other Information</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Committee Member</div>
                <div>{changeTypeToText(user.committeeType)}</div>
                <div>Committee Position</div>
                <div>
                  {changeTypeToText(
                    user.positionState || user.positionDistrict || "-",
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {!edit && (
          <Button
            type="button"
            size={"icon"}
            variant={"outline"}
            className="absolute -top-5 right-0"
            onClick={() => setEdit(true)}
          >
            <Edit />
          </Button>
        )}
      </div>
    </>
  );
};
