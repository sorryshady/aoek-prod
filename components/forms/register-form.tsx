/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { CardWrapper } from "../custom/card-wrapper";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { frontendRegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadThing } from "@/lib/uploadthing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import CustomDate from "../custom/custom-date";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  BloodGroup,
  Department,
  Designation,
  District,
  Gender,
  UserStatus,
} from "@prisma/client";
import { Button } from "../ui/button";
import SubmitButton from "../custom/submit-button";
import { FormSuccess } from "../custom/form-success";
import { FormError } from "../custom/form-error";
import { excludeFields } from "@/lib/utils";
import Link from "next/link";
import { FrontendRegisterSchema } from "@/schemas/register-schema";

export const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [employmentStatus, setEmploymentStatus] = useState<
    UserStatus | undefined
  >();

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<FrontendRegisterSchema>({
    resolver: zodResolver(frontendRegisterSchema),
    defaultValues: {
      name: "",
      dob: "",
      gender: undefined,
      bloodGroup: undefined,
      userStatus: undefined,
      department: undefined,
      designation: undefined,
      officeAddress: undefined,
      workDistrict: undefined,
      personalAddress: "",
      homeDistrict: undefined,
      email: "",
      phoneNumber: "",
      mobileNumber: "",
      photo: undefined,
    },
  });
  const onSubmit = async (data: FrontendRegisterSchema) => {
    try {
      setIsSubmitting(true);
      setSuccess("");
      setError("");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/register?email=${data.email}`,
      );
      const responseData = await response.json();
      if (responseData.error) {
        setError(responseData.error);
      } else if (response.ok) {
        let imgUrl = "";
        let photoId = "";
        if (data.photo) {
          const res = await startUpload([data.photo!], {});
          if (res) {
            photoId = res[0].key;
            imgUrl = res[0].url;
          }
        }
        let submitData = { ...data, photoUrl: imgUrl, photoId: photoId };
        submitData = excludeFields(submitData, ["photo"]);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/auth/register`,
          {
            method: "POST",
            body: JSON.stringify(submitData),
          },
        );
        const registerResponse = await response.json();
        if (response.ok) {
          setSuccess(registerResponse.success);
        } else {
          setError(registerResponse.error);
        }
        form.reset();
      }
    } catch (error: any) {
      console.error(JSON.stringify(error.errors[0].message, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <CardWrapper
      headerLabel="Register"
      backButtonHref="/login"
      backButtonLabel="Have an account?"
    >
      {!success.length ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-lg mx-auto"
          >
            {/* Personal Details */}
            <div className="space-y-4">
              <Label className="text-xl font-semibold">Personal Details</Label>
              <FormField //name
                control={form.control}
                disabled={isSubmitting}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField //date of birth
                control={form.control}
                disabled={isSubmitting}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of birth *</FormLabel>
                    <CustomDate control={form.control} name="dob" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField //gender
                control={form.control}
                disabled={isSubmitting}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Gender).map((item) => (
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
              <FormField
                control={form.control}
                disabled={isSubmitting}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Group *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(BloodGroup).map((item) => (
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
            {/* Employment Information */}
            <div className="space-y-4">
              <Label className="text-xl font-semibold">
                Employment Information
              </Label>
              <FormField //User Status
                control={form.control}
                disabled={isSubmitting}
                name="userStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status *</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setEmploymentStatus(value as UserStatus);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Employment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserStatus.WORKING}>
                          Working
                        </SelectItem>
                        <SelectItem value={UserStatus.RETIRED}>
                          Retired
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {employmentStatus === UserStatus.WORKING && (
                <>
                  <FormField // department
                    control={form.control}
                    disabled={isSubmitting}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department *</FormLabel>
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
                  <FormField //designation
                    control={form.control}
                    disabled={isSubmitting}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select designation" />
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
                  <FormField //office address
                    control={form.control}
                    disabled={isSubmitting}
                    name="officeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Office Address *</FormLabel>
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
                  <FormField //working district
                    control={form.control}
                    disabled={isSubmitting}
                    name="workDistrict"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Working District *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select working district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(District).map((item) => (
                              <SelectItem key={item} value={item}>
                                <span className="capitalize">
                                  {item.toLowerCase()}
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
            {/* Permanent Address  */}
            <div className="space-y-4">
              <Label className="text-xl font-semibold">
                Permanent Contact Information
              </Label>
              <FormField //permanent address
                control={form.control}
                disabled={isSubmitting}
                name="personalAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permanent Address *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your permanent address."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField //home district
                control={form.control}
                disabled={isSubmitting}
                name="homeDistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home District *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select home district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(District).map((item) => (
                          <SelectItem key={item} value={item}>
                            <span className="capitalize">
                              {item.toLowerCase()}
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
            {/* Contact Details */}
            <div className="space-y-4">
              <Label className="text-xl font-semibold">Contact Details</Label>
              <FormField //email
                control={form.control}
                disabled={isSubmitting}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField //phone number
                control={form.control}
                disabled={isSubmitting}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField //mobile number
                control={form.control}
                disabled={isSubmitting}
                name="mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your mobile number."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Verification */}
            <div className="space-y-4">
              <Label className="text-xl font-semibold">Verification</Label>
              <FormField //photo
                control={form.control}
                name="photo"
                disabled={isSubmitting}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file); // Manually pass the File object to form state
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <SubmitButton
              title="Submit Information"
              isSubmitting={isSubmitting}
              className="w-full"
            />
          </form>
        </Form>
      ) : (
        <div className="w-full flex flex-col justify-center items-center gap-5">
          <FormSuccess
            message={
              "Your data has been successfully submitted. Wait for admin approval."
            }
          />
          <div className="flex gap-5 w-full">
            <Button className=" w-full flex-1" onClick={() => setSuccess("")}>
              New Registration
            </Button>
            <Button asChild className=" w-full flex-1">
              <Link href={"/"}>Go to Home</Link>
            </Button>
          </div>
        </div>
      )}
    </CardWrapper>
  );
};
export default RegisterForm;
