import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/shared/query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AcadNexa — Multi-Tenant Campus Management System",
  description:
    "Institutional Academic Management, Real-time Attendance Hub, Dynamic Scheduling & Continuous Evaluations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-background text-foreground`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
