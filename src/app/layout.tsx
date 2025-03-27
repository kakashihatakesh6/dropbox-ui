import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dropbox",
  description: "Interactive scroll animation for Dropbox brand design system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
