import type { Metadata } from "next";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Pencil,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DauChart } from "@/components/admin/dau-chart";
import {
  ADMIN_KPIS,
  ADMIN_REPORTS,
  ADMIN_USERS,
  DAU_SERIES,
} from "@/lib/data/demo-admin";
import { getWorldsProgress } from "@/lib/data/map";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  const worlds = getWorldsProgress();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="font-pixel text-2xl sm:text-3xl">Admin</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Content management, users, and moderation.
          </p>
        </div>
        <Badge variant="destructive" className="ml-auto">
          <ShieldAlert /> Admin only
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {ADMIN_KPIS.map((kpi) => (
          <Card key={kpi.label} className="gap-2 p-4">
            <p className="text-muted-foreground text-xs font-semibold">
              {kpi.label}
            </p>
            <p className="font-display text-2xl font-bold">{kpi.value}</p>
            <p
              className={cn(
                "inline-flex items-center gap-1 text-xs font-semibold",
                kpi.trend === "up" ? "text-success" : "text-destructive",
              )}
            >
              {kpi.trend === "up" ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {kpi.change} vs last week
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily active users</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <DauChart data={DAU_SERIES} />
        </CardContent>
      </Card>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card className="gap-0 overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="text-muted-foreground px-5 py-3 font-semibold">World</th>
                  <th className="text-muted-foreground px-5 py-3 font-semibold">Nodes</th>
                  <th className="text-muted-foreground px-5 py-3 font-semibold">Status</th>
                  <th className="text-muted-foreground px-5 py-3 font-semibold">Est. hours</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {worlds.slice(0, 10).map(({ world }) => (
                  <tr key={world.slug} className="hover:bg-secondary/40">
                    <td className="px-5 py-3 font-semibold">
                      {world.order}. {world.title}
                    </td>
                    <td className="text-muted-foreground px-5 py-3">
                      {world.lessonCount}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="success">Published</Badge>
                    </td>
                    <td className="text-muted-foreground px-5 py-3">
                      ~{world.estimatedHours}h
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="ghost" size="sm">
                        <Pencil className="size-3.5" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-muted-foreground border-t border-border px-5 py-3 text-xs">
              Showing 10 of 25 worlds
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="gap-0 overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="text-muted-foreground px-5 py-3 font-semibold">User</th>
                  <th className="text-muted-foreground px-5 py-3 font-semibold">Level</th>
                  <th className="text-muted-foreground px-5 py-3 font-semibold">Plan</th>
                  <th className="text-muted-foreground px-5 py-3 font-semibold">Status</th>
                  <th className="text-muted-foreground px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ADMIN_USERS.map((u) => (
                  <tr key={u.username} className="hover:bg-secondary/40">
                    <td className="px-5 py-3">
                      <p className="font-semibold">@{u.username}</p>
                      <p className="text-muted-foreground text-xs">{u.email}</p>
                    </td>
                    <td className="text-muted-foreground px-5 py-3">{u.level}</td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={u.tier === "free" ? "secondary" : "gold"}
                        className="capitalize"
                      >
                        {u.tier}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge
                        variant={u.status === "active" ? "success" : "destructive"}
                        className="capitalize"
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="text-muted-foreground px-5 py-3">{u.joined}</td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="size-3.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="flex flex-col gap-3">
          {ADMIN_REPORTS.map((r) => (
            <Card key={r.id} className="flex-row items-center gap-4 p-4">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  r.status === "resolved"
                    ? "bg-success/15 text-success"
                    : "bg-destructive/15 text-destructive",
                )}
              >
                {r.status === "resolved" ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <ShieldAlert className="size-5" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{r.subject}</p>
                <p className="text-muted-foreground text-xs">
                  {r.reason} · reported by {r.reporter} · {r.age} ago
                </p>
              </div>
              <Badge
                variant={
                  r.status === "resolved"
                    ? "success"
                    : r.status === "reviewing"
                      ? "gold"
                      : "destructive"
                }
                className="capitalize"
              >
                {r.status}
              </Badge>
              {r.status !== "resolved" && (
                <Button variant="secondary" size="sm">
                  Review
                </Button>
              )}
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
