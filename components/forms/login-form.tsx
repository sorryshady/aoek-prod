"use client";
import { useForm } from "react-hook-form";
import { CardWrapper } from "../custom/card-wrapper";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailIdSchema, LoginSchema, SignupSchema } from "@/schemas";
import { Input } from "../ui/input";
import { useState } from "react";
import { FormError } from "../custom/form-error";
import { FormSuccess } from "../custom/form-success";
import ShowPassword from "../custom/show-password";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SecurityQuestionType } from "@prisma/client";
import SubmitButton from "../custom/submit-button";
import { SessionUser } from "@/types";
import { useAuth } from "@/app/providers/auth-context";
import { useSearchParams } from "next/navigation";
import { AuthStage } from "@/types/session-types";
import { Button } from "../ui/button";
import Link from "next/link";

const LoginForm = () => {
  const params = useSearchParams();
  const redirectTo = decodeURIComponent(params.get("redirectTo") || "/");
  const { error, user, authStage, login, isSubmitting } = useAuth();
  const form = useForm<z.infer<typeof EmailIdSchema>>({
    resolver: zodResolver(EmailIdSchema),
    defaultValues: {
      emailOrId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof EmailIdSchema>) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailOrId);
    await login(values.emailOrId, isEmail);
  };
  return (
    <CardWrapper
      headerLabel={"Login"}
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
    >
      {!user && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-lg mx-auto"
          >
            <FormField
              control={form.control}
              disabled={isSubmitting}
              name="emailOrId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email of Membership ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email or membership id"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <SubmitButton
              title={"Submit"}
              isSubmitting={isSubmitting}
              className="w-full"
            />
          </form>
        </Form>
      )}
      {user ? (
        authStage === AuthStage.FIRST_LOGIN_PASSWORD_SETUP ? (
          <FirstLogin user={user} redirectTo={redirectTo} />
        ) : authStage === AuthStage.PASSWORD_ENTRY ? (
          <NormalLogin user={user} redirectTo={redirectTo} />
        ) : null
      ) : null}
    </CardWrapper>
  );
};

export default LoginForm;

interface LoginProps {
  user: SessionUser;
  redirectTo: string;
}
const FirstLogin = ({ user, redirectTo }: LoginProps) => {
  const { isSubmitting, success, error, setupFirstLogin } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      question: "MOTHERS_MAIDEN_NAME",
      answer: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    await setupFirstLogin(
      values.password,
      values.question,
      values.answer,
      redirectTo,
    );
  };
  return (
    <>
      <p className="text-base text-muted-foreground mb-5 text-center">
        Welcome{" "}
        <span className="text-black font-bold text-center">{user.name}</span>.
        Set a password for your account.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-lg mx-auto"
        >
          <FormField
            control={form.control}
            disabled={isSubmitting}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Security Question</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      value={SecurityQuestionType.MOTHERS_MAIDEN_NAME}
                    >
                      Your mother&apos;s maiden name.
                    </SelectItem>
                    <SelectItem value={SecurityQuestionType.FAVOURITE_BOOK}>
                      Your favourite book.
                    </SelectItem>
                    <SelectItem value={SecurityQuestionType.FAVOURITE_CAR}>
                      Your favorite car.
                    </SelectItem>
                    <SelectItem value={SecurityQuestionType.FIRST_PET}>
                      Your first pet.
                    </SelectItem>
                    <SelectItem value={SecurityQuestionType.FIRST_SCHOOL}>
                      Your first school.
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isSubmitting}
            name="answer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Answer</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter answer to security question"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This answer will be used to recover your account in case of
                  lost password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            disabled={isSubmitting}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a password"
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
            disabled={isSubmitting}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password"
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

          <FormError message={error} />
          <FormSuccess message={success} />
          <SubmitButton
            title="Sign Up"
            isSubmitting={isSubmitting}
            className="w-full"
          />
        </form>
      </Form>
    </>
  );
};
const NormalLogin = ({ user, redirectTo }: LoginProps) => {
  const { isSubmitting, success, error, enterPassword } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    await enterPassword(values.password, redirectTo);
  };
  return (
    <>
      <p className="text-base text-muted-foreground mb-5 text-center">
        Welcome{" "}
        <span className="text-black font-bold text-center">{user.name}</span>.
        Enter your password to login.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-lg mx-auto"
        >
          <FormField
            control={form.control}
            disabled={isSubmitting}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <div className="flex w-full justify-between">
                  <ShowPassword
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                  <Button
                    variant={"link"}
                    className="px-0 font-normal"
                    size={"sm"}
                    type="button"
                    asChild
                  >
                    <Link
                      href={`/forgot-password?email=${user.email || ""}&membershipId=${user.membershipId || ""}`}
                    >
                      Forgot Password?
                    </Link>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <SubmitButton
            title="Login"
            isSubmitting={isSubmitting}
            className="w-full"
          />
        </form>
      </Form>
    </>
  );
};
