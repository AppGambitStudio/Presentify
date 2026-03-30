"use client";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ChartBlockProps { type: "bar" | "pie" | "line"; data: { label: string; value: number }[]; }

export function ChartBlock({ type, data }: ChartBlockProps) {
  const chartData = data.map((d) => ({ name: d.label, value: d.value }));
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {type === "bar" ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--slide-card-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--slide-text-muted)" fontSize={12} tickLine={false} />
            <YAxis stroke="var(--slide-text-muted)" fontSize={12} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "var(--slide-bg)", border: "1px solid var(--slide-card-border)", borderRadius: "8px" }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (<Cell key={i} fill={i === 0 ? "var(--slide-primary)" : "var(--slide-accent)"} />))}
            </Bar>
          </BarChart>
        ) : type === "pie" ? (
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {chartData.map((_, i) => (<Cell key={i} fill={i % 2 === 0 ? "var(--slide-primary)" : "var(--slide-accent)"} />))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--slide-card-border)" />
            <XAxis dataKey="name" stroke="var(--slide-text-muted)" fontSize={12} />
            <YAxis stroke="var(--slide-text-muted)" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="var(--slide-primary)" strokeWidth={2} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
