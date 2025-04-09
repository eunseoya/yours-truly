import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Barcode } from "@/components/barcode"

export default function HomePage() {
  const barcodeValue = 1234502920120 // Example barcode value
  // Ensure the barcode value is 12 digits long
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container max-w-md mx-auto p-4">
        <div className="flex flex-col items-center gap-8">
            <div className="relative w-72 text-center">
            <div className="mb-4 px-4 py-2 border rounded-full text-sm uppercase tracking-wider inline-block bg-white">
              PROFILE
              </div>
            <div className="relative w-72 border rounded-md p-6 flex flex-col items-center font-mono text-sm drop-shadow-lg bg-white">
                <div className="absolute top-[-5px] left-[10px] rotate-12 w-36 h-42  bg-white p-2 pt-2 pb-8 shadow-lg rounded-md text-center transform hover:scale-105 hover:rotate-2 transition duration-300">
                  <Image src="/logo.png" alt="Polaroid Photo" width={256} height={192} className="w-64 mx-auto rounded-sm" />
                </div>
                  <h2 className="uppercase text-xs tracking-wider text-gray-500 mb-4">Profile</h2>
                  
                  <div className="w-full max-w-xs mb-6">
                    <div className="w-full mb-2 border-b border-gray-300 pb-2">
                    <div className="text-center">
                    <p className="text-gray-600">make this look more like a receipt</p>
                    <p className="text-gray-800">04/07/2025</p>
                    </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 w-full max-w-xs">
                    <div className="flex justify-between mb-1">
                    <p>USER NAME:</p>
                    <p>012kes</p>
                    </div>
                    <div className="flex justify-between mb-1">
                    <p>ITEMS:</p>
                    <p>12</p>
                    </div>
                    <div className="flex justify-between mb-1">
                    <p>MEMORIES:</p>
                    <p>36</p>
                    </div>
                    <div className="flex justify-between mb-1">
                    <p>SINCE:</p>
                    <p>01.01.2023</p>
                    </div>
                  </div>
                    <div className=" justify-between m-2 ">
                    <Barcode value={barcodeValue} />
                    <div className="mt-2 text-xs text-gray-600 uppercase text-center tracking-tighter">
                      <p>
                      How have you changed your things, 
                      </p>
                      <p>and how have your things changed you?
                      </p>    
                      </div>
                      </div>
                  </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center">
            <div className="relative w-80 h-80 text-center">
            <div className="mb-2 px-4 py-2 border rounded-full text-sm uppercase tracking-wider inline-block bg-white">
              Archive
              </div>
            <Link href="/archive" className="w-full">
              <Image
              src="/envelope.svg"
              alt="Envelope"
              fill
              className="object-contain"
              />
               </Link>
            </div>
            </div>
        </div>
      </main>
    </div>
  )
}
