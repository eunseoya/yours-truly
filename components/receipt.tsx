import { Barcode } from "@/components/barcode";

interface ReceiptProps {
  date: string;
  details: { label: string; value: string | number }[];
  barcodeValue: number;
}

export function Receipt({ date, details, barcodeValue }: ReceiptProps) {
  return (
    <div className="relative w-72 border rounded-md p-6 flex flex-col items-center font-mono text-sm drop-shadow-lg bg-white">
      <h2 className="uppercase text-xs tracking-wider text-gray-500 mb-4">
        Profile
      </h2>
      <div className="w-full max-w-xs mb-6">
        <div className="w-full mb-2 border-b border-gray-300 pb-2">
          <div className="text-center">
            <p className="text-gray-800">{date}</p>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-600 w-full max-w-xs">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between mb-1">
            <p>{detail.label}:</p>
            <p>{detail.value}</p>
          </div>
        ))}
      </div>
      <div className="justify-between mt-8">
        <Barcode value={barcodeValue} />
        <div className="mt-2 text-xs text-gray-600 uppercase text-center tracking-tighter">
          <p>How have you changed your things,</p>
          <p>and how have your things changed you?</p>
        </div>
      </div>
    </div>
  );
}
