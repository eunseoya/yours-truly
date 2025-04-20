import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Merge a date string (YYYY-MM-DD or DD.MM.YYYY) with the current time, return "dd.MM.yyyy HH:mm"
export function mergeDateWithCurrentTime(dateStr: string): string {
  let day: string, month: string, year: string;
  if (dateStr.includes("-")) {
    // yyyy-MM-dd
    [year, month, day] = dateStr.split("-");
  } else if (dateStr.includes(".")) {
    // dd.MM.yyyy or dd.MM.yy
    [day, month, year] = dateStr.split(".");
    if (year.length === 2) year = `20${year}`;
  } else {
    return dateStr;
  }
  const now = new Date();
  const [hh, mm] = now.toTimeString().split(" ")[0].split(":");
  return `${day}.${month}.${year} ${hh}:${mm}`;
}

// Accepts Date or string (with or without time)
export function formatTimeAgo(dateInput: string | Date): string {
  try {
    let date: Date;
    if (typeof dateInput === "string") {
      // Try to parse with time
      if (dateInput.includes(" ")) {
        // dd.MM.yyyy HH:mm
        const [dmy, hm] = dateInput.split(" ");
        const [day, month, year] = dmy.split(".");
        const [hh, mm] = hm.split(":");
        date = new Date(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hh),
          Number(mm)
        );
      } else {
        // fallback to parseDate
        const parsed = parseDate(dateInput);
        if (!parsed) return "Invalid date";
        date = parsed;
      }
    } else {
      date = dateInput;
    }
    if (isNaN(date.getTime())) return "Invalid date";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

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
    // Support "dd.MM.yyyy" or "dd.MM.yy" or "dd.MM.yyyy HH:mm" or "dd.MM.yy HH:mm"
    let [datePart, timePart] = dateStr.split(" ");
    const [day, month, year] = datePart.split(".");
    if (!day || !month || !year) return null;

    // Support both 2- and 4-digit year
    const fullYear =
      year.length === 2
        ? Number.parseInt(`20${year}`)
        : Number.parseInt(year);

    let hours = 0, minutes = 0;
    if (timePart) {
      const [hh, mm] = timePart.split(":");
      hours = Number.parseInt(hh);
      minutes = Number.parseInt(mm);
    }

    const date = new Date(
      fullYear,
      Number.parseInt(month) - 1,
      Number.parseInt(day),
      hours,
      minutes
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
  // If the item has no memories, use the item date as the last used date
  if (item.memories.length === 0) {
    return parseDate(item.date);
  }

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

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// reformat yyyy-MM-dd to dd.MM.yyyy
export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

// merge chosen date with current time and format as "dd.MM.yyyy HH:mm"
export function formatDateTime(dateStr: string): string {
  const [dayMonthYear] = [formatDate(dateStr)];
  const now = new Date();
  const [hh, mm] = now.toTimeString().split(" ")[0].split(":");
  return `${dayMonthYear} ${hh}:${mm}`;
}

// read a File as DataURL
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function checkName(name: string): boolean {
  const re = /^[A-Za-z0-9 ]+$/;
  return re.test(name);
}

export function getLastMemoryDateForAllItems(items: Item[]): string {
  const allDates = items.flatMap((item) =>
    item.memories.map((memory) => parseDate(memory.date))
  );

  const lastMemoryDate = allDates.reduce((latest, current) => {
    if (!latest || (current && current > latest)) {
      return current;
    }
    return latest;
  }, null);

  if (!lastMemoryDate) return "";

  const formattedDate = lastMemoryDate.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return formattedDate.replace(",", "");
}

export function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}
