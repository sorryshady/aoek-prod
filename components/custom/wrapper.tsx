import React from "react";

const Wrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div className={`max-w-7xl mx-auto p-5 ${className ?? ""}`} {...rest}>
      {children}
    </div>
  );
};

export default Wrapper;
