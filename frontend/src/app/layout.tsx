import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DIProvider } from "./di/container";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "kyo1941",
  description: "kyo1941の個人サイト。日々の出来事や開発に関する情報を発信しています。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DIProvider />
        {children}
      </body>
    </html>
  );
}
