import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  icons: {
    icon: '/icon.png',           // regular favicon
    apple: '/apple-icon.png',    // Apple touch icon
  },
  title: "Regional Content Generator",
  description: "Made by Hari",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="https://img.icons8.com/?size=100&id=37628&format=png&color=000000" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
