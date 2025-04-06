import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const browserLocale = navigator.language ?? "en-US";
export const NumberFormatter = new Intl.NumberFormat(browserLocale);
export const PercentFormatter = new Intl.NumberFormat(browserLocale, {
  style: "percent",
  maximumFractionDigits: 2,
});

export const optionalTransform = <T, R>(
  value: T | undefined,
  fn: (x: T) => R
) => {
  if (value === undefined) {
    return undefined;
  }

  return fn(value);
};
