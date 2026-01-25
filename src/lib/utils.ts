import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCleanDomain(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.replace(/^www\./, "");
  } catch (e) {
    return url;
  }
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

export function getRelativeTimeString(date: Date | number, lang = navigator.language): string {
  const timeMs = typeof date === "number" ? date : date.getTime();
  const diff = timeMs - Date.now();
  const absDiff = Math.abs(diff);

  const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
    { unit: "year", ms: 31536000000 },
    { unit: "month", ms: 2592000000 },
    { unit: "day", ms: 86400000 },
    { unit: "hour", ms: 3600000 },
    { unit: "minute", ms: 60000 },
    { unit: "second", ms: 1000 },
  ];

  for (const { unit, ms } of units) {
    if (absDiff >= ms || unit === "second") {
      const value = Math.round(diff / ms);
      const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
      return rtf.format(value, unit);
    }
  }

  return "";
}

export function formatToLocalTime(isoString: string): string {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date);
}

export function getPageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  pages.push(1);

  if (current > 3) {
    pages.push("ellipsis-start");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis-end");
  }

  pages.push(total);
  return pages;
}

export function stringToStringArray(string?: string) {
  if (!string) return [""];
  return string.split(" ");
}
