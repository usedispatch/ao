import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string) {
  return address.length > 10
    ? `${address.substring(0, 7)}...${address.slice(-3)}`
    : address;
}
