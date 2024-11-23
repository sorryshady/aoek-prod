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
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Department, Designation, District, UserStatus } from "@prisma/client";
import { Input } from "../ui/input";
import SubmitButton from "../custom/submit-button";
import { Edit } from "lucide-react";
import { useAuth } from "@/app/providers/auth-context";
import { FormError } from "../custom/form-error";
import { useRouter } from "next/navigation";

export const AccountUpdate = ({ user }: { user: SessionUser }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState<
    UserStatus | undefined
  >(user.userStatus);

  const initialData = useMemo(
    () => ({
      userStatus: user.userStatus,
      department: user.department ? user.department : undefined,
      designation: user.designation ? user.designation : undefined,
      officeAddress: user.officeAddress ? user.officeAddress : undefined,
      workDistrict: user.workDistrict ? user.workDistrict : undefined,
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
      if (values.userStatus === "RETIRED") {
        // Remove officeAddress when status is RETIRED
        delete values.officeAddress;
        delete values.department;
        delete values.designation;
        delete values.workDistrict;
      } else {
        if (
          !values.officeAddress ||
          !values.workDistrict ||
          !values.department ||
          !values.designation
        ) {
          setError(
            "Designation, department, work district and office address fields are required if working",
          );
          toast.error("All employment fields are required if user is working");
          return;
        }
      }
      const submissionData = {
        ...values,
        officeAddress: values.officeAddress ? values.officeAddress : null,
        workDistrict: values.workDistrict ? values.workDistrict : null,
        department: values.department ? values.department : null,
        designation: values.designation ? values.designation : null,
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
        console.log("error encountered");
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
                <h2 className="text-xl font-bold">Employment Information</h2>
                <div className="grid grid-cols-2 capitalize gap-5">
                  <div>Employment Status</div>
                  <FormField
                    control={form.control}
                    name="userStatus"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setEmploymentStatus(value as UserStatus);
                            if (value === "RETIRED") {
                              setIsDialogOpen(true);
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your current status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="WORKING">Working</SelectItem>
                            <SelectItem value="RETIRED">Retired</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {employmentStatus === "WORKING" && (
                    <>
                      <div>Department</div>
                      <FormField // department
                        control={form.control}
                        // disabled={isSubmitting}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(Department).map((item) => (
                                  <SelectItem key={item} value={item}>
                                    <span className="capitalize">
                                      {item.toLowerCase().replace("_", " ")}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>Designation</div>
                      <FormField // designation
                        control={form.control}
                        // disabled={isSubmitting}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Designation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.values(Designation).map((item) => (
                                  <SelectItem key={item} value={item}>
                                    <span className="capitalize">
                                      {item.toLowerCase().split("_").join(" ")}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>Office Address</div>
                      <FormField //office address
                        control={form.control}
                        // disabled={isSubmitting}
                        name="officeAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter office address."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>Work District</div>
                      <FormField // workDistrict
                        control={form.control}
                        // disabled={isSubmitting}
                        name="workDistrict"
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
                                      {item.toLowerCase().replace("_", " ")}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>
              <Separator />
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
                                  {item.toLowerCase().replace("_", " ")}
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
                  <div>{user.committeeType.toLowerCase()}</div>
                  <div>Committee Position</div>
                  <div>
                    {user.positionState || user.positionDistrict || "NA"}
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
                    setEmploymentStatus(user.userStatus);
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
          <div className="space-y-10">
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Employment Information</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Employment Status</div>
                <div>{user.userStatus.toLowerCase()}</div>
                {user.userStatus === "WORKING" && (
                  <>
                    <div>Department</div>
                    <div>{user.department!.toLowerCase()}</div>
                    <div>Designation</div>
                    <div>
                      {user.designation!.toLowerCase().split("_").join(" ")}
                    </div>
                    <div>Office Address</div>
                    <div>{user.officeAddress!.toLowerCase()}</div>
                    <div>Work District</div>
                    <div>{user.workDistrict!.toLowerCase()}</div>
                  </>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Permanent Address</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Permanent Address</div>
                <div>{user.personalAddress.toLowerCase()}</div>
                <div>Home District</div>
                <div>{user.homeDistrict.toLowerCase()}</div>
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
                <div>{user.phoneNumber || "NA"}</div>
                <div>Mobile Number</div>
                <div>{user.mobileNumber}</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-5">
              <h2 className="text-xl font-bold">Other Information</h2>
              <div className="grid grid-cols-2 capitalize gap-5">
                <div>Committee Member</div>
                <div>{user.committeeType.toLowerCase()}</div>
                <div>Committee Position</div>
                <div>{user.positionState || user.positionDistrict || "NA"}</div>
              </div>
            </div>
          </div>
        )}
        {!edit && (
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
