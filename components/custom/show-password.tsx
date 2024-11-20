"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

type ShowPasswordProps = {
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
};

const ShowPassword: React.FC<ShowPasswordProps> = ({
  showPassword,
  setShowPassword,
}) => {
  return (
    <Button
      variant={"link"}
      className="px-0 font-normal"
      size={"sm"}
      type="button"
      onClick={() => setShowPassword(!showPassword)}
    >
      Show Password
    </Button>
  );
};
export default ShowPassword;
