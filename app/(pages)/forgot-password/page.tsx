import Wrapper from "@/components/custom/wrapper";
import ForgotPassword from "@/components/forms/forgot-password";
import { SecurityQuestionType, User } from "@prisma/client";
import React from "react";

async function getData({
  email,
  membershipId,
}: {
  email: string;
  membershipId: string;
}): Promise<
  User & {
    securityQuestion: {
      question: SecurityQuestionType;
    }[];
  }
> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/auth/user/password?email=${email}&membershipId=${membershipId}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data = await response.json();

  return data;
}
export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string; membershipId: string }>;
}) {
  const { email, membershipId } = await searchParams;
  const data = await getData({ email, membershipId });

  return (
    <Wrapper className="my-[5rem] flex justify-center items-center min-h-[70vh]">
      <ForgotPassword
        securityQuestion={data.securityQuestion[0].question}
        membershipId={data.membershipId}
        email={data.email}
      />
    </Wrapper>
  );
}
