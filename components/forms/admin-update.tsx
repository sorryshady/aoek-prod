/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { SessionUser } from "@/types";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import {
  updateProfileSchema,
  UpdateProfileSchema,
} from "@/schemas/update-profile-schema";
import { adminUpdateSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
  FormLabel,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  CommitteeType,
  Department,
  Designation,
  District,
  DistrictPositionTitle,
  StatePositionTitle,
  UserStatus,
} from "@prisma/client";
import { Input } from "../ui/input";
import SubmitButton from "../custom/submit-button";
import { Edit } from "lucide-react";
import { FormError } from "../custom/form-error";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminUpdateSchema } from "@/schemas/admin-update-schema";
import { changeTypeToText } from "@/lib/utils";

export const AdminUpdate = ({ user }: { user: SessionUser }) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("status");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [committeeStatus, setCommitteeStatus] = useState<CommitteeType>(
    user.committeeType,
  );

  const initialData = useMemo(
    () => ({
      userStatus: user.userStatus,
      committeeType: user.committeeType,
      userRole: user.userRole,
      positionState: user.positionState ? user.positionState : undefined,
      positionDistrict: user.positionDistrict
        ? user.positionDistrict
        : undefined,
    }),
    [user],
  );

  const form = useForm<AdminUpdateSchema>({
    resolver: zodResolver(adminUpdateSchema),
    defaultValues: initialData,
  });
  const { reset } = form;

  const onSubmit = async (values: AdminUpdateSchema) => {
    try {
      setIsSubmitting(true);
      const hasChanges = Object.keys(initialData).some(
        (key) =>
          initialData[key as keyof AdminUpdateSchema] !==
          values[key as keyof AdminUpdateSchema],
      );
      if (!hasChanges) {
        setError("");
        toast.error("No changes made");
        return;
      }
      if (values.committeeType === "NONE") {
        values.positionDistrict = undefined;
        values.positionState = undefined;
      } else {
        if (values.committeeType === "STATE" && !values.positionState) {
          setError(
            "Position State is required if user belongs to State committee.",
          );
          toast.error(
            "Position State is required if user belongs to State committee.",
          );
          return;
        }
      }
      const submissionData = {
        ...values,
        positionState: values.positionState ? values.positionState : null,
        positionDistrict: values.positionDistrict
          ? values.positionDistrict
          : null,
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
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-x-5 gap-y-4">
                  <InfoField label="Name" value={user.name} />
                  <InfoField
                    label="Date of Birth"
                    value={new Date(user.dob).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  />
                  <InfoField
                    label="Gender"
                    value={changeTypeToText(user.gender)}
                  />
                  <InfoField
                    label="Blood Group"
                    value={changeTypeToText(user.bloodGroup)}
                  />
                  <InfoField
                    label="User Status"
                    value={changeTypeToText(user.userStatus)}
                  />
                  {user.userRole && (
                    <FormField
                      control={form.control}
                      name="userRole"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-2 items-center">
                          <span className="w-32 font-medium text-muted-foreground">
                            User Role
                          </span>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select User Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="REGULAR">User</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {user.membershipId && (
                    <InfoField
                      label="Membership ID"
                      value={user.membershipId.toString()}
                    />
                  )}
                </div>
              </section>
              <Separator />
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Employment Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                  <InfoField
                    label="Department"
                    value={changeTypeToText(user.department || "-")}
                  />
                  <InfoField
                    label="Designation"
                    value={changeTypeToText(user.designation || "-")}
                  />
                  <InfoField
                    label="Office Address"
                    value={user.officeAddress || "-"}
                  />
                  <InfoField
                    label="Work District"
                    value={changeTypeToText(user.workDistrict || "-")}
                  />
                </div>
              </section>
              <Separator />
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Permanent Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                  <InfoField label="Address" value={user.personalAddress} />
                  <InfoField
                    label="Home District"
                    value={changeTypeToText(user.homeDistrict)}
                  />
                </div>
              </section>
              <Separator />
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                  <InfoField label="Email" value={user.email} />
                  <InfoField
                    label="Phone Number"
                    value={user.phoneNumber || "-"}
                  />
                  <InfoField label="Mobile Number" value={user.mobileNumber} />
                </div>
              </section>
              <Separator />
              {user.workDistrict && (
                <section>
                  <h2 className="text-2xl font-semibold mb-4">
                    Committee Information
                  </h2>
                  <div className="grid grid-cols-1 gap-x-5 gap-y-4">
                    <FormField // committee type
                      control={form.control}
                      // disabled={isSubmitting}
                      name="committeeType"
                      render={({ field }) => (
                        <FormItem className="grid grid-cols-2 items-center">
                          <span className="w-32 font-medium text-muted-foreground">
                            Committee Type
                          </span>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setCommitteeStatus(value as CommitteeType);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select committee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(CommitteeType).map((item) => (
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
                    {committeeStatus === "STATE" && (
                      <FormField //Position State
                        control={form.control}
                        // disabled={isSubmitting}
                        name="positionState"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-2 items-center">
                            <span className="w-32 font-medium text-muted-foreground">
                              Position
                            </span>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(StatePositionTitle).map(
                                  (item) => (
                                    <SelectItem key={item} value={item}>
                                      <span className="capitalize">
                                        {changeTypeToText(item)}
                                      </span>
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {committeeStatus === "DISTRICT" && (
                      <>
                        <FormField //Position State
                          control={form.control}
                          // disabled={isSubmitting}
                          name="positionDistrict"
                          render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center">
                              <span className="w-32 font-medium text-muted-foreground">
                                Position
                              </span>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select position" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {Object.values(DistrictPositionTitle).map(
                                    (item) => (
                                      <SelectItem key={item} value={item}>
                                        <span className="capitalize">
                                          {changeTypeToText(item)}
                                        </span>
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <InfoField
                          label="District"
                          value={changeTypeToText(user.workDistrict || "-")}
                        />
                      </>
                    )}
                  </div>
                </section>
              )}

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
                    setCommitteeStatus(user.committeeType);
                    setEdit(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="space-y-3">
                  <DialogHeader className="space-y-5">
                    <DialogTitle>Employment Status</DialogTitle>
                    <DialogDescription className="text-black">
                      If you are <span className="font-bold">retired</span>,
                      your department, designation, office address and working
                      district will be removed when submitting the form.
                    </DialogDescription>
                  </DialogHeader>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Understood
                  </Button>
                </DialogContent>
              </Dialog>
            </form>
          </Form>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <InfoField label="Name" value={user.name} />
                <InfoField
                  label="Date of Birth"
                  value={new Date(user.dob).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
                <InfoField
                  label="Gender"
                  value={changeTypeToText(user.gender)}
                />
                <InfoField
                  label="Blood Group"
                  value={changeTypeToText(user.bloodGroup)}
                />
                <InfoField
                  label="User Status"
                  value={changeTypeToText(user.userStatus)}
                />
                {user.userRole && (
                  <InfoField
                    label="User Role"
                    value={changeTypeToText(user.userRole!)}
                  />
                )}
                {user.membershipId && (
                  <InfoField
                    label="Membership ID"
                    value={user.membershipId.toString()}
                  />
                )}
              </div>
            </section>
            <Separator />
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Employment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <InfoField
                  label="Department"
                  value={changeTypeToText(user.department || "-")}
                />
                <InfoField
                  label="Designation"
                  value={changeTypeToText(user.designation || "-")}
                />
                <InfoField
                  label="Office Address"
                  value={user.officeAddress || "-"}
                />
                <InfoField
                  label="Work District"
                  value={changeTypeToText(user.workDistrict || "-")}
                />
              </div>
            </section>
            <Separator />
            <section>
              <h2 className="text-2xl font-semibold mb-4">Permanent Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <InfoField label="Address" value={user.personalAddress} />
                <InfoField
                  label="Home District"
                  value={changeTypeToText(user.homeDistrict)}
                />
              </div>
            </section>
            <Separator />
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <InfoField label="Email" value={user.email} />
                <InfoField
                  label="Phone Number"
                  value={user.phoneNumber || "-"}
                />
                <InfoField label="Mobile Number" value={user.mobileNumber} />
              </div>
            </section>
            <Separator />
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Committee Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                <InfoField
                  label="Committee Type"
                  value={changeTypeToText(user.committeeType || "-")}
                />
                {user.committeeType === "STATE" && (
                  <InfoField
                    label="Position State"
                    value={changeTypeToText(user.positionState || "-")}
                  />
                )}

                {user.committeeType === "DISTRICT" && (
                  <>
                    <InfoField
                      label="Position District"
                      value={changeTypeToText(user.positionDistrict || "-")}
                    />
                    <InfoField
                      label="District"
                      value={changeTypeToText(user.workDistrict || "-")}
                    />
                  </>
                )}
              </div>
            </section>
          </div>
        )}
        {!edit && query === "verified" && (
          <Button
            type="button"
            size={"icon"}
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

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 items-start">
      <span className="w-32 font-medium text-muted-foreground">{label}</span>
      <span className="overflow-hidden text-ellipsis">{value}</span>
    </div>
  );
}
