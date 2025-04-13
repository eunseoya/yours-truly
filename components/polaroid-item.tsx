import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import type { Item } from "@/types";

interface PolaroidItemProps {
  item: Item;
}

export function PolaroidItem({ item }: PolaroidItemProps) {
  // Calculate how many memories to show in the stack (max 3)
  const stackCount = Math.min(item.memories.length + 1, 3);

  // Create an array for the stack
  const stack = Array.from({ length: stackCount }, (_, i) => i);

  // Safely format the date
  const formatDate = (dateStr: string) => {
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

      // Check if date is valid before formatting
      if (isNaN(date.getTime())) return "Invalid date";

      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Unknown date";
    }
  };

  return (
    <div className="polaroid-stack">
      {stack.map((index) => (
        <div key={index} className="polaroid">
          <div className="relative aspect-square w-full mb-2">
            <Image
              src={item.image || "/logo.svg?height=300&width=300"}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          {index === 0 && (
            <div className="text-xs text-gray-600 mt-1 flex items-center justify-between">
              <span>{item.name}</span>
              <span className="text-[10px]">{formatDate(item.date)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
