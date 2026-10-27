import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Great_Vibes,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import BackgroundMusic from "@/components/BackgroundMusic";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aswathi & Mibin | A Beautiful Beginning",
  description:
    "Join Aswathi Surendran and Mibin Thomas as they begin their forever. 28 December 2026, 5:00 PM at St. Sebastian’s Church, Koodaranji, Calicut, Kerala.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Aswathi Surendran & Mibin Thomas | Wedding Invitation",
    description:
      "With the love and blessings of our families. Join us on 28 December 2026 at 5:00 PM, St. Sebastian’s Church, Koodaranji.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${jakarta.variable} ${script.variable} scroll-smooth h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-500">
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
