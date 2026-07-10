import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ParticleField } from "@/components/marketing/particle-field";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <ParticleField count={16} />
      <header className="relative z-10 mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_0_20px_rgba(255,122,26,0.5)]">
            <Sparkles className="size-5" />
          </span>
          <span className="font-pixel text-base tracking-wide">CodeQuest</span>
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        {children}
      </main>
    </div>
  );
}
