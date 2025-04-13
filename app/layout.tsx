import type React from "react";
import type { Metadata } from "next";
import { Inter, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "200",
});
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Yours Truly - Digital Archive",
  description: "A digital archive for your cherished items and memories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pinyon.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import "./globals.css";
