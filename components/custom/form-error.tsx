"use client";
import { TriangleAlert, X } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface FormErrorProps {
  message: string | null;
  visible?: boolean;
  requestId?: string;
}

export const FormError = ({ message, visible, requestId }: FormErrorProps) => {
  if (!message) return null;
  const router = useRouter();
  const clickHandler = async () => {
    if (requestId) {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/auth/user/requests?requestId=${requestId}`,
        {
          method: "PATCH",
        },
      );
    }
    router.refresh();
  };
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive w-full">
      <TriangleAlert className="h-6 w-6" />
      <p>{message}</p>
      {visible && (
        <Button
          className="ml-auto"
          size={"icon"}
          variant={"destructive"}
          onClick={clickHandler}
        >
          <X />
        </Button>
      )}
    </div>
  );
};
