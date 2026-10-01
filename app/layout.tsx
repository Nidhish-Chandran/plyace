import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plyace - Career Guidance & Placement Unit (CGPU)",
  description: "Official institutional campus placement portal with real-time academic eligibility matching, ATS resume scoring, alumni 18-month career window, and proctored technical evaluations.",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
