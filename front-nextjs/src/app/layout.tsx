import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FullCycle Ingressos',
  description: 'FullCycle Ingressos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex flex-col items-center bg-primary text-default`}
      >
        <div className="p-4 md:p-10 w-full max-w-[1256px]">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
