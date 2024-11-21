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
import { LoginResponseUser } from "@/types/user-types";
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
const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState({
    user: null as LoginResponseUser | null,
    firstLogin: false,
  });

  const form = useForm<z.infer<typeof EmailIdSchema>>({
    resolver: zodResolver(EmailIdSchema),
    defaultValues: {
      emailOrId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof EmailIdSchema>) => {
    try {
      setError("");
      setIsSubmitting(true);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailOrId);
      const url = isEmail
        ? `/api/login?email=${values.emailOrId}`
        : `/api/login?membershipId=${values.emailOrId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      }
      setResponse(data);
    } catch (error) {
      setError("An unexpected error occured!");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <CardWrapper
      headerLabel={"Login"}
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
    >
      {!response.user && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-lg mx-auto"
          >
            <FormField
              control={form.control}
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
      {response.user ? (
        response.firstLogin ? (
          <FirstLogin user={response.user} />
        ) : (
          <NormalLogin user={response.user} />
        )
      ) : null}
    </CardWrapper>
  );
};

export default LoginForm;

interface LoginProps {
  user: LoginResponseUser;
}
const FirstLogin = ({ user }: LoginProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
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
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/login?firstLogin=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            membershipId: user.membershipId,
            question: values.question,
            answer: values.answer,
            password: values.password,
          }),
        },
      );
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess("Successful login. Please wait while we redirect you.");
      }
    } catch (error) {
      setError("An unexpected error occured!");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <p className="text-base text-muted-foreground mb-5">
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
const NormalLogin = ({ user }: LoginProps) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/login?firstLogin=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            membershipId: user.membershipId,
            password: values.password,
          }),
        },
      );
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess("Successful login. Please wait while we redirect you.");
      }
    } catch (error) {
      setError("An unexpected error occured!");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <p className="text-base text-muted-foreground mb-5">
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
            title="Login"
            isSubmitting={isSubmitting}
            className="w-full"
          />
        </form>
      </Form>
    </>
  );
};
