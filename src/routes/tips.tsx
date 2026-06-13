import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Zap, Bike, Recycle, Droplet, ShoppingBag, Thermometer, Leaf } from "lucide-react";

export const Route = createFileRoute("/tips")({
  head: () => ({
    meta: [
      { title: "Sustainability Tips — Verdant" },
      { name: "description", content: "Daily eco-friendly actions, energy-saving ideas, and green transportation suggestions." },
      { property: "og:title", content: "Sustainability Tips — Verdant" },
      { property: "og:description", content: "Daily eco-friendly actions, energy-saving ideas, and green transportation suggestions." },
    ],
  }),
  component: TipsPage,
});

const categories = [
  {
    title: "Daily eco actions",
    icon: Lightbulb,
    accent: "from-emerald-500/15 to-emerald-500/5 text-emerald-700",
    tips: [
      { t: "Carry a reusable bottle", d: "Skip single-use plastic and save hundreds of bottles per year." },
      { t: "Use cloth bags for shopping", d: "Keep a few in your bag or car so you're never caught short." },
      { t: "Eat seasonal & local", d: "Lower food-mile emissions and support nearby farms." },
      { t: "Compost food scraps", d: "Diverts methane-producing waste from landfill." },
    ],
  },
  {
    title: "Save energy at home",
    icon: Zap,
    accent: "from-amber-500/15 to-amber-500/5 text-amber-700",
    tips: [
      { t: "Switch to LED bulbs", d: "Use up to 80% less electricity than incandescent." },
      { t: "Unplug idle electronics", d: "Standby power can account for 5–10% of home energy use." },
      { t: "Wash clothes in cold water", d: "Up to 90% of washing energy goes to heating water." },
      { t: "Air-dry when possible", d: "Save energy and extend the life of your clothes." },
    ],
  },
  {
    title: "Green transport",
    icon: Bike,
    accent: "from-sky-500/15 to-sky-500/5 text-sky-700",
    tips: [
      { t: "Walk or bike short trips", d: "Trips under 3 km are often faster on foot or by bike." },
      { t: "Combine errands", d: "Plan one efficient loop instead of multiple drives." },
      { t: "Try public transit weekly", d: "A bus replaces ~30 cars on the road." },
      { t: "Consider an EV or hybrid", d: "When it's time to replace your car." },
    ],
  },
  {
    title: "Reduce & reuse",
    icon: Recycle,
    accent: "from-violet-500/15 to-violet-500/5 text-violet-700",
    tips: [
      { t: "Repair before replacing", d: "Mending and tailoring extend an item's life by years." },
      { t: "Buy second-hand first", d: "Thrift, swap, and resell platforms are gold." },
      { t: "Choose durable goods", d: "Quality over quantity saves money and resources." },
      { t: "Recycle properly", d: "Rinse containers and learn local rules to avoid contamination." },
    ],
  },
  {
    title: "Water wisdom",
    icon: Droplet,
    accent: "from-cyan-500/15 to-cyan-500/5 text-cyan-700",
    tips: [
      { t: "Shorter showers", d: "Cutting just 2 minutes saves ~20 L per shower." },
      { t: "Fix leaks quickly", d: "A dripping tap wastes ~5,500 L per year." },
      { t: "Run full loads only", d: "Both dishwashers and washing machines work most efficiently when full." },
    ],
  },
  {
    title: "Mindful shopping",
    icon: ShoppingBag,
    accent: "from-rose-500/15 to-rose-500/5 text-rose-700",
    tips: [
      { t: "Wait 24 hours", d: "Sleep on non-essential purchases to avoid impulse buys." },
      { t: "Choose minimal packaging", d: "Bulk buying often means less waste per unit." },
      { t: "Support B-Corps & local", d: "Vote with your wallet for responsible companies." },
    ],
  },
];

function TipsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Tips</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Small actions, real impact.</h1>
        <p className="mt-2 text-muted-foreground">
          Pick a few that fit your life. Even 2–3 sustained habits can cut hundreds of kilos of CO₂ per year.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Highlight icon={Thermometer} value="1–2°C" label="Lower thermostat saves ~10% on heating" />
        <Highlight icon={Leaf} value="500 kg" label="CO₂ saved yearly by skipping meat 3 days/week" />
        <Highlight icon={Bike} value="~150 kg" label="CO₂ saved swapping a 5-km drive for biking" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((c) => (
          <div key={c.title} className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${c.accent}`}>
                <c.icon className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold">{c.title}</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {c.tips.map((tip) => (
                <li key={tip.t} className="rounded-xl border bg-secondary/30 p-3">
                  <p className="text-sm font-semibold">{tip.t}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{tip.d}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Highlight({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string; label: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}