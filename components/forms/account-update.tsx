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
  FormLabel,
  FormMessage,
  FormControl,
  FormDescription,
} from "../ui/form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
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

export const AccountUpdate = ({ user }: { user: SessionUser }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employmentStatus, setEmploymentStatus] = useState<
    UserStatus | undefined
  >(user.userStatus);

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      userStatus: user.userStatus,
      department: user.department ? user.department : undefined,
      designation: user.designation ? user.designation : undefined,
      officeAddress: user.officeAddress ? user.officeAddress : undefined,
      workDistrict: user.workDistrict ? user.workDistrict : undefined,
      personalAddress: user.personalAddress,
      homeDistrict: user.homeDistrict,
      phoneNumber: user.phoneNumber ? user.phoneNumber : undefined,
      mobileNumber: user.mobileNumber,
    },
  });
  const onSubmit = (values: UpdateProfileSchema) => {
    if (values.userStatus !== "WORKING") {
      // Remove officeAddress when status is RETIRED
      delete values.officeAddress;
      delete values.department;
      delete values.designation;
      delete values.workDistrict;
    }

    // Display toast with submitted values
    toast("Form Submitted", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  };
  return (
    <>
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
              <FormField //office address
                control={form.control}
                // disabled={isSubmitting}
                name="personalAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter permanent address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>Home District</div>
              <FormField // workDistrict
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
              <div className="lowercase">{user.email}</div>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="space-y-3">
              <DialogHeader className="space-y-5">
                <DialogTitle>Employment Status</DialogTitle>
                <DialogDescription className="text-black">
                  If you are <span className="font-bold">retired</span>, your
                  department, designation, office address and working district
                  will be removed when submitting the form.
                </DialogDescription>
              </DialogHeader>
              <Button onClick={() => setIsDialogOpen(false)}>Understood</Button>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </>
  );
};
