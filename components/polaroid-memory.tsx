import Image from "next/image";
import type { Memory } from "@/types";

interface PolaroidMemoryProps {
  memory: Memory;
  index: number;
}

export function PolaroidMemory({ memory, index }: PolaroidMemoryProps) {
  // Alternate the rotation for a more natural look
  const rotation = index % 2 === 0 ? "rotate-1" : "-rotate-1";

  return (
    <div className={`polaroid max-w-xs mx-auto ${rotation}`}>
      <div className="relative aspect-square w-full mb-2">
        <Image
          src={memory.image || "/placeholder.svg"}
          alt="Memory"
          fill
          className="object-cover"
        />
      </div>
      <div className="p-2">
        <div className="text-xs text-gray-400 mb-1">{memory.date}</div>
        <p className="text-sm">{memory.description}</p>
      </div>
    </div>
  );
}
