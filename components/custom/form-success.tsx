import { CircleCheck } from "lucide-react";
interface FormSuccessProps {
  message: string | null;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CircleCheck className="h-6 w-6" />
      <p>{message}</p>
    </div>
  );
};
