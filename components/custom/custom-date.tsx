import React from "react";
import { useController } from "react-hook-form";
import { Input } from "../ui/input";

type CustomDateProps = {
  name: string;
  control: any; // Type from react-hook-form
  placeholder?: string;
};

const CustomDate: React.FC<CustomDateProps> = ({
  name,
  control,
  placeholder = "MM/DD/YYYY",
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: "", // Ensure initial value is an empty string
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let formattedValue = value.replace(/[^\d/]/g, "");

    // Handle deletion and insertion logic
    if (formattedValue.length > 2 && !formattedValue.includes("/")) {
      formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
    }

    if (formattedValue.length > 5 && formattedValue.split("/").length < 3) {
      formattedValue = `${formattedValue.slice(0, 5)}/${formattedValue.slice(5)}`;
    }

    formattedValue = formattedValue.slice(0, 10);
    field.onChange(formattedValue);
  };

  return (
    <div>
      <Input
        type="text"
        {...field}
        placeholder={placeholder}
        onChange={handleChange}
        maxLength={10}
      />
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
};

export default CustomDate;
