import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateStr: string): string {
  try {
    // Parse date in format DD.MM.YY
    const [day, month, year] = dateStr.split(".");
    if (!day || !month || !year) return "Invalid date";

    // Create a proper date with 20xx for the year
    const fullYear = Number.parseInt(`20${year}`);
    const date = new Date(
      fullYear,
      Number.parseInt(month) - 1,
      Number.parseInt(day),
    );

    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid date";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    // Format based on time difference
    if (diffMin < 60) {
      return `${diffMin}m`;
    } else if (diffHr < 24) {
      return `${diffHr}hr`;
    } else if (diffDays === 1) {
      return `1 day ago`;
    } else if (diffDays < 30) {
      return `${diffDays}d`;
    } else {
      return `${Math.floor(diffDays / 30)}mo`;
    }
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Unknown";
  }
}

export function parseDate(dateStr: string): Date | null {
  try {
    // Parse date in format DD.MM.YY
    const [day, month, year] = dateStr.split(".");
    if (!day || !month || !year) return null;

    // Create a proper date with 20xx for the year
    const fullYear = Number.parseInt(`20${year}`);
    const date = new Date(
      fullYear,
      Number.parseInt(month) - 1,
      Number.parseInt(day),
    );

    // Check if date is valid
    if (isNaN(date.getTime())) return null;

    return date;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}

export function isItemUnused(item: Item): boolean {
  // Check if the item has been unused for more than 1 month
  const lastUsedDate = getLastUsedDate(item);
  if (!lastUsedDate) return false;

  const now = new Date();
  const diffMs = now.getTime() - lastUsedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays > 30; // More than 30 days (1 month)
}

export function getLastUsedDate(item: Item): Date | null {
  // Get the most recent date from the item or its memories
  const dates: Date[] = [];

  // Add item creation date
  const itemDate = parseDate(item.date);
  if (itemDate) dates.push(itemDate);

  // Add memory dates
  item.memories.forEach((memory) => {
    const memoryDate = parseDate(memory.date);
    if (memoryDate) dates.push(memoryDate);
  });

  if (dates.length === 0) return null;

  // Return the most recent date
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}
