"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  Trophy,
  BarChart3,
  Users,
  ShoppingBag,
  UserRound,
  Settings,
  ShieldHalf,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/learn", label: "Learn", icon: Map },
  { href: "/achievements", label: "Achievements", icon: Trophy },
  { href: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { href: "/community", label: "Community", icon: Users },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const SECONDARY = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Admin", icon: ShieldHalf },
];

export function Sidebar() {
  const pathname = usePathname();

  function NavLink({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
  }) {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
          active
            ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(255,122,26,0.3)]"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        )}
      >
        <Icon className="size-5 shrink-0" />
        <span className="hidden lg:inline">{label}</span>
      </Link>
    );
  }

  return (
    <aside className="sticky top-0 z-30 flex h-screen w-16 shrink-0 flex-col border-r border-border bg-background/80 backdrop-blur lg:w-60">
      <div className="flex h-16 items-center px-3 lg:px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_0_20px_rgba(255,122,26,0.5)]">
            <Sparkles className="size-5" />
          </span>
          <span className="font-pixel hidden text-sm tracking-wide lg:inline">
            CodeQuest
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-4 lg:px-3">
        {NAV.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
        <div className="mt-auto flex flex-col gap-1">
          {SECONDARY.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
