import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sacred Journal",
  description:
    "Personality-aware journaling app with AI coaching, multimodal input, and knowledge graph integration",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-sacred-purple-50 via-white to-sacred-teal-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
