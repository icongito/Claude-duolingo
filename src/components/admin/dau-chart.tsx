"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DauPoint } from "@/lib/data/demo-admin";

export function DauChart({ data }: { data: DauPoint[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
          <defs>
            <linearGradient id="dau-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF7A1A" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#FF7A1A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#BDBDBD", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#BDBDBD", fontSize: 12 }}
            tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
            width={44}
          />
          <ChartTooltip
            contentStyle={{
              background: "#1F1F1F",
              border: "1px solid rgba(255,122,26,0.3)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 12,
            }}
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Active users",
            ]}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#FF7A1A"
            strokeWidth={2.5}
            fill="url(#dau-fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
