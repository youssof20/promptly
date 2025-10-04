import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
