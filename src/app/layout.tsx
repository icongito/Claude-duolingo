import type { Metadata, Viewport } from "next";
import { Sora, Space_Grotesk, JetBrains_Mono, Pixelify_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

// Chunky, rounded pixel-block display face used sparingly for hero
// headlines, level badges, and other game-y accents.
const pixelifySans = Pixelify_Sans({
  variable: "--font-pixel-sans",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CodeQuest — Level Up as a Developer",
    template: "%s · CodeQuest",
  },
  description:
    "CodeQuest is the addictive, Duolingo-style way to master Claude Code, AI development, and modern software engineering — one glowing lesson at a time.",
  metadataBase: new URL("https://codequest.dev"),
  openGraph: {
    title: "CodeQuest — Level Up as a Developer",
    description:
      "Learn Claude Code, prompt engineering, React, Git, and more through bite-sized, gamified lessons.",
    siteName: "CodeQuest",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${pixelifySans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
