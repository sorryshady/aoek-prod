import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const excludeFields = <T, Key extends keyof T>(
  obj: T,
  keys: Key[],
): Omit<T, Key> => {
  const newObj = { ...obj };
  keys.forEach((key) => delete newObj[key]);
  return newObj;
};

export const changeTypeToText = (value: string) => {
  const lower = value.toLowerCase().split("_").join(" ");
  const returnValue = lower.charAt(0).toUpperCase() + lower.slice(1);
  return returnValue;
};
