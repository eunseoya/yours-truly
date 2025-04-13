// Barcode.tsx
import React from "react";

type BarcodeProps = {
  value: number;
  width?: number;
  height?: number;
  barColor?: string;
};

export const Barcode: React.FC<BarcodeProps> = ({
  value,
  width = 400,
  height = 20,
  barColor = "black",
}) => {
  const binary = value.toString(2); // convert number to binary string
  const bars = binary.padStart(16, "0").split(""); // pad to 16 bits for consistency

  const barWidth = width / bars.length;

  return (
    <div
      className="flex justify-center"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {bars.map((bit, index) => {
        const isThick = bit === "1";
        return (
          <div
            key={index}
            style={{
              width: isThick ? barWidth * 0.4 : barWidth * 0.2,
              height: height,
              backgroundColor: barColor,
              marginRight: barWidth * 0.1,
            }}
          />
        );
      })}
    </div>
  );
};
