import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dropbox Brand Transition",
  description: "Interactive scroll animation for Dropbox brand design system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <nav className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center">
          <div className="text-lg font-bold text-[#0061FF]">
            <Link href="/">Dropbox</Link>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-800 hover:text-[#0061FF] transition-colors">
              Home
            </Link>
            <Link href="/brand-transition" className="text-gray-800 hover:text-[#0061FF] transition-colors">
              Brand System
            </Link>
          </div>
        </nav> */}
        {children}
      </body>
    </html>
  );
}
