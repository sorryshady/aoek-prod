"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import Header from "./header";
interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  className?: string;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  className,
}: CardWrapperProps) => {
  return (
    <Card
      className={cn(
        "lg:w-[600px] md:w-[70vw] w-full shadow-md mx-auto",
        className,
      )}
    >
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>

      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};

interface BackButtonProps {
  label: string;
  href: string;
}
const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button variant={"link"} className="font-normal mx-auto" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
