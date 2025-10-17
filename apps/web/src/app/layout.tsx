import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Promptly - Open Source AI Prompt Optimizer",
  description: "Open source AI prompt optimizer that automatically improves your prompts before sending to AI systems. Works with your own API keys, supports local AI models, and is completely free.",
  keywords: ["AI", "prompt optimization", "ChatGPT", "Claude", "browser extension", "open source", "free", "privacy"],
  authors: [{ name: "Promptly Team" }],
  openGraph: {
    title: "Promptly - Open Source AI Prompt Optimizer",
    description: "Open source AI prompt optimizer that automatically improves your prompts before sending to AI systems. Works with your own API keys and is completely free.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Promptly - Open Source AI Prompt Optimizer",
    description: "Open source AI prompt optimizer that automatically improves your prompts before sending to AI systems.",
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
        className={`${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
