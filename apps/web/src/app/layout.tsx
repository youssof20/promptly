import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
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
  title: "Promptly - AI Prompt Optimizer",
  description: "Automatically improve your prompts before sending to ChatGPT, Claude, and other AI systems. Get better results without learning prompt engineering.",
  keywords: ["AI", "prompt optimization", "ChatGPT", "Claude", "browser extension", "productivity"],
  authors: [{ name: "Promptly Team" }],
  openGraph: {
    title: "Promptly - AI Prompt Optimizer",
    description: "Automatically improve your prompts before sending to AI systems. Get better results without learning prompt engineering.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promptly - AI Prompt Optimizer",
    description: "Automatically improve your prompts before sending to AI systems.",
  },
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
