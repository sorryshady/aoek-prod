"use client";
import React from "react";
import { Button, ButtonProps } from "../ui/button";
import { useAuth } from "@/app/providers/auth-context";

interface LogoutButtonProps extends ButtonProps {
  title?: string;
}
const LogoutButton = ({
  title,
  variant,
  className,
  size,
  children,
}: LogoutButtonProps) => {
  const { logout } = useAuth();
  const logoutHandler = () => {
    logout();
  };
  return (
    <Button
      variant={variant}
      className={className}
      size={size}
      onClick={logoutHandler}
    >
      {children || title}
    </Button>
  );
};

export default LogoutButton;
