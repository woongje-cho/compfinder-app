import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CompFinder — Global Engineering Competition Dashboard",
    template: "%s | CompFinder",
  },
  description:
    "Discover engineering competitions worldwide. Robotics, autonomous driving, AI/ML, and more — automatically aggregated and classified by tier.",
  keywords: [
    "engineering competitions",
    "robotics competition",
    "autonomous driving challenge",
    "AI hackathon",
    "ML competition",
    "STEM contest",
  ],
  openGraph: {
    title: "CompFinder — Global Engineering Competition Dashboard",
    description:
      "Discover engineering competitions worldwide. Robotics, autonomous driving, AI/ML, and more.",
    type: "website",
    siteName: "CompFinder",
  },
  twitter: {
    card: "summary_large_image",
    title: "CompFinder — Global Engineering Competition Dashboard",
    description:
      "Discover engineering competitions worldwide. Robotics, autonomous driving, AI/ML, and more.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 font-sans text-zinc-50">
        {children}
      </body>
    </html>
  );
}
