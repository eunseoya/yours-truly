import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(dateStr: string): string {
  try {
    // Parse date in format DD.MM.YY
    const [day, month, year] = dateStr.split(".")
    if (!day || !month || !year) return "Invalid date"

    // Create a proper date with 20xx for the year
    const fullYear = Number.parseInt(`20${year}`)
    const date = new Date(fullYear, Number.parseInt(month) - 1, Number.parseInt(day))

    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid date"

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHr = Math.floor(diffMin / 60)
    const diffDays = Math.floor(diffHr / 24)

    // Format based on time difference
    if (diffMin < 60) {
      return `${diffMin}m`
    } else if (diffHr < 24) {
      return `${diffHr}hr`
    } else if (diffDays === 1) {
      return `1 day ago`
    } else if (diffDays < 30) {
      return `${diffDays}d`
    } else {
      return `${Math.floor(diffDays / 30)}mo`
    }
  } catch (error) {
    console.error("Error formatting time:", error)
    return "Unknown"
  }
}
