import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** A standalone link (not inside a sentence) keeps a press target of 24 px on a pointer and 44 px on a phone (gates.md section 2). */
export const tapTarget = "inline-flex min-h-11 items-center sm:min-h-6";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
