import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plyace - Bridging Students & Career Opportunities",
  description: "Gamified college placement platform with real-time eligibility matching, ATS resume scoring, passout lifecycle support, and secure skill testing.",
  icons: {
    icon: "/plyace-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#2563EB]/20 selection:text-[#1E3A8A]">
        {children}
      </body>
    </html>
  );
}
