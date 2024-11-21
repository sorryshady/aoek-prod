"use client";
import { useAuth } from "@/app/providers/auth-context";
import Wrapper from "@/components/custom/wrapper";
import { Loader2 } from "lucide-react";

export default function Account() {
  const { user } = useAuth();
  return (
    <Wrapper className="flex flex-col justify-center items-center border">
      {!user ? (
        <div className="flex flex-col justify-center items-center">
          <Loader2 className="animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div>{user.name}</div>
          <div>{user.email}</div>
          <div className="capitalize">{user.userRole}</div>
        </div>
      )}
    </Wrapper>
  );
}
