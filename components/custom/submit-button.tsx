"use client";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "../ui/button";

interface SubmitButtonProps extends ButtonProps {
  title: string;
  isSubmitting: boolean;
}
const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  isSubmitting,
  ...rest
}) => {
  return (
    <Button type="submit" {...rest} disabled={isSubmitting}>
      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : title}
    </Button>
  );
};

export default SubmitButton;
