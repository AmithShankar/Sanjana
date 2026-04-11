import type { Metadata } from "next";
import "./globals.css";
import { ThemeSync } from "@/components/ThemeSync";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Sanjana",
  description: "Your intelligent conversational AI assistant",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="h-screen overflow-hidden bg-bg-base">
        <ThemeSync />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
