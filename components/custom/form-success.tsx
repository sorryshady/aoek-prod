"use client";
import { CircleCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
interface FormSuccessProps {
  message: string | null;
  visible?: boolean;
  requestId?: string;
}

export const FormSuccess = ({
  message,
  visible,
  requestId,
}: FormSuccessProps) => {
  const router = useRouter();
  if (!message) return null;
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
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 w-full">
      <CircleCheck className="h-6 w-6" />
      <p>{message}</p>
      {visible && (
        <Button
          className="ml-auto bg-emerald-500"
          size={"icon"}
          onClick={clickHandler}
        >
          <X />
        </Button>
      )}
    </div>
  );
};
