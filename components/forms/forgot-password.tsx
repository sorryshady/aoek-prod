"use client";
import React, { useState } from "react";
import { CardWrapper } from "../custom/card-wrapper";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "@/schemas/forgot-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { changeTypeToText } from "@/lib/utils";
import { Input } from "../ui/input";
import ShowPassword from "../custom/show-password";
import SubmitButton from "../custom/submit-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ForgotPassword = ({
  securityQuestion,
  membershipId,
  email,
}: {
  securityQuestion: string;
  membershipId: number;
  email: string;
}) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      answer: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const response = await fetch("/api/auth/user/password?type=reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          membershipId,
          email,
          answer: data.answer,
          password: data.password,
        }),
      });

      if (response.ok) {
        toast.success("Password updated successfully. Redirecting to login...");
        form.reset();
        setTimeout(() => {
          router.push("/login");
        }, 500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Password change error:", error);
    }
  };
  return (
    <CardWrapper
      headerLabel={"Forgot Password"}
      backButtonLabel="Go back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-lg mx-auto"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Your security question: {changeTypeToText(securityQuestion)}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your answer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter new password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm new password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <ShowPassword
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            title="Change Password"
            isSubmitting={form.formState.isSubmitting}
          />
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgotPassword;
