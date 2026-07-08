import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge conditional class names + resolve Tailwind conflicts. Shared across the app.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
