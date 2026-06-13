import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { Trash2, Plus, TrendingDown, TrendingUp, Leaf, Calendar } from "lucide-react";
import { clearRecords, loadRecords, sampleRecords, type SavedRecord } from "../lib/carbon";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Your Carbon Trends" },
      { name: "description", content: "Track your carbon footprint over time and see how your habits are evolving." },
      { property: "og:title", content: "Dashboard — Your Carbon Trends" },
      { property: "og:description", content: "Track your carbon footprint over time." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [records, setRecords] = useState<SavedRecord[]>([]);
  const [isSample, setIsSample] = useState(false);

  useEffect(() => {
    const saved = loadRecords();
    if (saved.length === 0) {
      setRecords(sampleRecords());
      setIsSample(true);
    } else {
      setRecords(saved);
      setIsSample(false);
    }
  }, []);

  function handleClear() {
    clearRecords();
    setRecords(sampleRecords());
    setIsSample(true);
  }

  const sorted = [...records].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const chartData = sorted.map((r) => ({
    date: new Date(r.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    total: Math.round(r.result.total),
    travel: Math.round(r.result.travel),
    electricity: Math.round(r.result.electricity),
    food: Math.round(r.result.food),
  }));

  const latest = sorted[sorted.length - 1];
  const previous = sorted[sorted.length - 2];
  const delta = latest && previous ? latest.result.total - previous.result.total : 0;
  const deltaPct = previous ? (delta / previous.result.total) * 100 : 0;
  const avg = sorted.reduce((s, r) => s + r.result.total, 0) / Math.max(1, sorted.length);
  const best = sorted.reduce((m, r) => (r.result.total < m.result.total ? r : m), sorted[0]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Dashboard</p>
          <h1 className="mt-1 truncate text-3xl font-bold tracking-tight sm:text-4xl">Your progress</h1>
          <p className="mt-2 text-muted-foreground">
            {isSample
              ? "Showing sample data — save your first calculation to start tracking."
              : "Saved snapshots are stored locally in your browser."}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New
          </Link>
          {!isSample && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-secondary"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Latest footprint"
          value={`${Math.round(latest?.result.total ?? 0)} kg`}
          sub="CO₂ this month"
          icon={<Leaf className="h-4 w-4" />}
        />
        <StatCard
          label="Average"
          value={`${Math.round(avg)} kg`}
          sub={`over ${sorted.length} records`}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          label="Change vs last"
          value={`${delta >= 0 ? "+" : ""}${Math.round(delta)} kg`}
          sub={previous ? `${deltaPct.toFixed(1)}%` : "—"}
          icon={delta <= 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
          positive={delta <= 0}
        />
        <StatCard
          label="Best record"
          value={`${Math.round(best?.result.total ?? 0)} kg`}
          sub={best ? new Date(best.date).toLocaleDateString() : "—"}
          icon={<TrendingDown className="h-4 w-4" />}
          positive
        />
      </div>

      {/* Trend */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold">Footprint over time</h2>
          <p className="text-sm text-muted-foreground">Total monthly CO₂ across your snapshots.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Area type="monotone" dataKey="total" stroke="var(--chart-1)" fill="url(#g1)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold">By category</h2>
          <p className="text-sm text-muted-foreground">How each source has evolved.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Line type="monotone" dataKey="travel" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="electricity" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="food" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Records table */}
      <div className="mt-6 rounded-2xl border bg-card shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-base font-semibold">Recent records</h2>
          <p className="text-sm text-muted-foreground">Your latest carbon snapshots.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Transport</th>
                <th className="px-6 py-3 text-right">Travel</th>
                <th className="px-6 py-3 text-right">Electricity</th>
                <th className="px-6 py-3 text-right">Food</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3 text-right">Category</th>
              </tr>
            </thead>
            <tbody>
              {[...sorted].reverse().map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-6 py-3 font-medium">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-6 py-3 capitalize text-muted-foreground">{r.transport}</td>
                  <td className="px-6 py-3 text-right">{Math.round(r.result.travel)} kg</td>
                  <td className="px-6 py-3 text-right">{Math.round(r.result.electricity)} kg</td>
                  <td className="px-6 py-3 text-right">{Math.round(r.result.food)} kg</td>
                  <td className="px-6 py-3 text-right font-semibold">{Math.round(r.result.total)} kg</td>
                  <td className="px-6 py-3 text-right">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        r.result.category === "Low"
                          ? "bg-emerald-100 text-emerald-800 ring-emerald-200"
                          : r.result.category === "Medium"
                            ? "bg-amber-100 text-amber-800 ring-amber-200"
                            : "bg-rose-100 text-rose-800 ring-rose-200"
                      }`}
                    >
                      {r.result.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  positive,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
        <span
          className={`grid h-7 w-7 place-items-center rounded-lg ${
            positive ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"
          }`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}