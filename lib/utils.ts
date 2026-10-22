import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui's class name helper: joins conditional classes and lets later
// Tailwind utilities override earlier ones (cn("p-2", big && "p-4")).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
