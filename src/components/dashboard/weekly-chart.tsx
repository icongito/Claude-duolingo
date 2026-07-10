"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyXpPoint } from "@/lib/data/demo-user";

export function WeeklyChart({ data }: { data: WeeklyXpPoint[] }) {
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
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
            width={40}
          />
          <ChartTooltip
            cursor={{ fill: "rgba(255,122,26,0.08)" }}
            contentStyle={{
              background: "#1F1F1F",
              border: "1px solid rgba(255,122,26,0.3)",
              borderRadius: 12,
              color: "#fff",
              fontSize: 12,
            }}
            formatter={(value) => [`${value} XP`, "Earned"]}
          />
          <Bar
            dataKey="xp"
            fill="#FF7A1A"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
