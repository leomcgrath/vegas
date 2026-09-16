import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Mono, Inter } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-ticker",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vegas Tracker",
  description: "Logg ølet og gevinstene dine, Vegas-stil.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d0417",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="no"
      className={`${bebas.variable} ${spaceMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
