import React from "react";

const Wrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={`max-w-7xl mx-auto p-5 space-y-5 mt-[6rem] lg:mt-[6rem] min-h-[44.7svh] ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Wrapper;
