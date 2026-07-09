import Link from "next/link";
import { Sparkles, Code2, AtSign, MessageCircle } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Worlds", href: "#worlds" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Community", href: "#" },
      { label: "Status", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <span className="font-pixel text-sm">CodeQuest</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The addictive, Duolingo-style way to master Claude Code, AI
              development, and modern software engineering.
            </p>
            <div className="mt-5 flex items-center gap-3 text-muted-foreground">
              <a href="#" aria-label="GitHub" className="hover:text-primary">
                <Code2 className="size-5" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-primary">
                <AtSign className="size-5" />
              </a>
              <a href="#" aria-label="Discord" className="hover:text-primary">
                <MessageCircle className="size-5" />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} CodeQuest. All rights reserved.</p>
          <p>Made for developers who like leveling up.</p>
        </div>
      </div>
    </footer>
  );
}
