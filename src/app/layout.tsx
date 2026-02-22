import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Loan Calculator",
  description: "Calculate loan terms, monthly payments, and amortization schedules",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a5276",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-surface text-text antialiased">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
