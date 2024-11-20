import React from "react";

interface WrapperProps extends React.ComponentProps<"div"> {}

const Wrapper: React.FC<WrapperProps> = ({ children, className, ...rest }) => {
  return (
    <div
      className={`max-w-7xl mx-auto p-5 space-y-16 mt-[6rem] lg:mt-[6rem] min-h-[44.7svh] border ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Wrapper;
