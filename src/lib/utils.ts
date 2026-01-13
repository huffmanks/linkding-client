import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Value {
  [key: string]: string | string[];
}

type ReturnType = "string" | "string_array";

type ProcessedValue<T, R extends ReturnType> = {
  [K in keyof T]: R extends "string" ? (T[K] extends string[] ? string : T[K]) : T[K];
};

export function processValue<T extends Value, R extends ReturnType>({
  value,
  returnType,
}: {
  value: T;
  returnType: R;
}): ProcessedValue<T, R> {
  const result = {} as any;

  for (const key in value) {
    const currentVal = value[key];

    if (typeof currentVal === "string") {
      result[key] = currentVal;
      continue;
    }

    if (Array.isArray(currentVal)) {
      const cleanedArray = currentVal.filter((item) => item.trim() !== "");

      if (returnType === "string") {
        result[key] = cleanedArray.join(", ");
      } else {
        result[key] = cleanedArray;
      }
    }
  }

  return result as ProcessedValue<T, R>;
}
