import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Car, Bus, Train, Bike, Footprints, Zap, Utensils, Lightbulb, TrendingUp, Save, Sparkles } from "lucide-react";
import {
  calculateFootprint,
  generateInsights,
  saveRecord,
  type CalculatorInput,
  type Transport,
  type Food,
} from "../lib/carbon";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Carbon Footprint Calculator — Verdant" },
      { name: "description", content: "Estimate your monthly CO₂ emissions from travel, electricity, and food in under a minute." },
      { property: "og:title", content: "Carbon Footprint Calculator — Verdant" },
      { property: "og:description", content: "Estimate your monthly CO₂ emissions from travel, electricity, and food." },
    ],
  }),
  component: CalculatorPage,
});

const TRANSPORTS: { value: Transport; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "car", label: "Car", icon: Car },
  { value: "bus", label: "Bus", icon: Bus },
  { value: "train", label: "Train", icon: Train },
  { value: "bike", label: "Bike", icon: Bike },
  { value: "walking", label: "Walking", icon: Footprints },
];

const FOODS: { value: Food; label: string; sub: string }[] = [
  { value: "vegetarian", label: "Vegetarian", sub: "Plant-forward" },
  { value: "mixed", label: "Mixed", sub: "Some meat" },
  { value: "non-vegetarian", label: "Non-veg", sub: "Meat-heavy" },
];

const categoryStyles: Record<string, string> = {
  Low: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  Medium: "bg-amber-100 text-amber-800 ring-amber-200",
  High: "bg-rose-100 text-rose-800 ring-rose-200",
};

function CalculatorPage() {
  const [input, setInput] = useState<CalculatorInput>({
    dailyKm: 20,
    transport: "car",
    monthlyKwh: 250,
    food: "mixed",
  });
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const result = useMemo(() => calculateFootprint(input), [input]);
  const insights = useMemo(() => generateInsights(input, result), [input, result]);

  const pieData = [
    { name: "Travel", value: Math.round(result.travel), color: "var(--chart-1)" },
    { name: "Electricity", value: Math.round(result.electricity), color: "var(--chart-2)" },
    { name: "Food", value: Math.round(result.food), color: "var(--chart-3)" },
  ];

  const barData = [
    { name: "Travel", you: Math.round(result.travel), avg: 250 },
    { name: "Electricity", you: Math.round(result.electricity), avg: 180 },
    { name: "Food", you: Math.round(result.food), avg: 175 },
  ];

  function handleSave() {
    saveRecord({
      ...input,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      result,
    });
    setSavedMsg("Saved to your dashboard!");
    setTimeout(() => setSavedMsg(null), 2500);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Calculator</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Your monthly footprint</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Adjust the inputs below — your results update instantly. Save snapshots to track progress over time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Car className="h-4 w-4 text-primary" /> Daily travel
            </h2>
            <label className="mt-4 block text-sm font-medium">Distance per day</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={200}
                value={input.dailyKm}
                onChange={(e) => setInput({ ...input, dailyKm: Number(e.target.value) })}
                className="flex-1 accent-primary"
              />
              <div className="w-20 rounded-md border bg-background px-2 py-1 text-right text-sm font-semibold">
                {input.dailyKm} km
              </div>
            </div>
            <label className="mt-5 block text-sm font-medium">Primary transport mode</label>
            <div className="mt-2 grid grid-cols-5 gap-2">
              {TRANSPORTS.map((t) => {
                const active = input.transport === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setInput({ ...input, transport: t.value })}
                    className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-xs font-medium transition ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    <t.icon className="h-5 w-5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Zap className="h-4 w-4 text-primary" /> Electricity
            </h2>
            <label className="mt-4 block text-sm font-medium">Monthly usage</label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={input.monthlyKwh}
                onChange={(e) => setInput({ ...input, monthlyKwh: Number(e.target.value) })}
                className="flex-1 accent-primary"
              />
              <div className="w-24 rounded-md border bg-background px-2 py-1 text-right text-sm font-semibold">
                {input.monthlyKwh} kWh
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Utensils className="h-4 w-4 text-primary" /> Food preference
            </h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {FOODS.map((f) => {
                const active = input.food === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setInput({ ...input, food: f.value })}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background hover:border-primary/50"
                    }`}
                  >
                    <div className="text-sm font-semibold">{f.label}</div>
                    <div className="text-xs text-muted-foreground">{f.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Estimated emissions</p>
                <p className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
                  {Math.round(result.total).toLocaleString()} <span className="text-base font-medium text-muted-foreground">kg CO₂ / month</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  ≈ {(result.total * 12 / 1000).toFixed(2)} t per year
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${categoryStyles[result.category]}`}>
                {result.category} impact
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr]">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                      {pieData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }}
                      formatter={(v: number) => [`${v} kg`, "CO₂"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 self-center">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ background: d.color }} />
                      <span className="text-sm font-medium">{d.name}</span>
                    </div>
                    <span className="text-sm font-semibold">{d.value} kg</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-muted-foreground">You vs. average person</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)" }}
                    />
                    <Bar dataKey="you" fill="var(--chart-1)" radius={[6, 6, 0, 0]} name="You" />
                    <Bar dataKey="avg" fill="var(--chart-2)" radius={[6, 6, 0, 0]} name="Average" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
              >
                <Save className="h-4 w-4" /> Save snapshot
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
              >
                <TrendingUp className="h-4 w-4" /> View dashboard
              </Link>
              {savedMsg && <span className="text-sm font-medium text-primary">{savedMsg}</span>}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <Sparkles className="h-4 w-4 text-primary" /> Personalized insights
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Biggest source of emissions: <span className="font-semibold capitalize text-foreground">{result.topSource}</span>
            </p>
            <ul className="mt-4 space-y-2.5">
              {insights.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Lightbulb className="h-4 w-4" />
                  </span>
                  <p className="text-sm">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}