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
  placeholder,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = e.target;
    let formattedValue = value.replace(/[^\d/]/g, "");

    // Handle deletion
    if (value.length < field.value.length) {
      // If a slash was just deleted, remove the preceding number too
      if (/\/$/.test(field.value.slice(0, selectionStart || 0))) {
        formattedValue = formattedValue.slice(0, -1);
      }
    } else {
      // Handle insertion
      if (formattedValue.length > 2 && !/^.{2}\//.test(formattedValue)) {
        formattedValue = formattedValue.replace(/^(.{2})/, "$1/");
      }
      if (formattedValue.length > 5 && !/^.{2}\/.{2}\//.test(formattedValue)) {
        formattedValue = formattedValue.replace(/^(.{2}\/.{2})/, "$1/");
      }
    }

    formattedValue = formattedValue.slice(0, 10);
    field.onChange(formattedValue);

    // Adjust cursor position
    setTimeout(() => {
      const newPosition = formattedValue.length;
      e.target.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <Input
      {...field}
      placeholder={placeholder || "DD/MM/YYYY"}
      onChange={handleChange}
    />
  );
};

export default CustomDate;
