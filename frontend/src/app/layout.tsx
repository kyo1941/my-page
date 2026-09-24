import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalSkyBackground from "./components/sky/ConditionalSkyBackground";
import { restoreChosenThemeScript } from "./utils/chosenTheme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "kyo1941.com";
const SITE_DESCRIPTION =
  "kyo1941の個人サイト。日々の出来事や開発に関する情報を発信しています。";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <title>{SITE_NAME}</title>
        <link rel="icon" href="/icon.jpg" type="image/jpeg" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-icon.jpg" sizes="180x180" />
        <script
          dangerouslySetInnerHTML={{ __html: restoreChosenThemeScript }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalSkyBackground />
        {children}
      </body>
    </html>
  );
}
