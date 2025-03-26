import type React from "react"
// import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Design System Grid",
  description: "Interactive design system grid with expandable sections",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  )
}

