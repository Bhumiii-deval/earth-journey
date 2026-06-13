import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Leaf, Globe2, TrendingDown, Sparkles, ArrowRight, Factory, Trees, Droplets } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdant — Understand Your Carbon Footprint" },
      { name: "description", content: "Learn what a carbon footprint is, why it matters, and how small daily choices add up to real change." },
      { property: "og:title", content: "Verdant — Understand Your Carbon Footprint" },
      { property: "og:description", content: "Learn what a carbon footprint is, why it matters, and how small daily choices add up to real change." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <div className="max-w-2xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Leaf className="h-3.5 w-3.5" /> A friendlier planet starts with awareness
            </span>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Measure your impact. Live a little lighter.
            </h1>
            <p className="mt-5 text-balance text-lg text-white/90 sm:text-xl">
              Verdant helps you understand your carbon footprint and turn everyday choices — commute, energy, food — into meaningful climate action.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/calculator"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary shadow-lg shadow-black/10 transition hover:bg-white/90"
              >
                Calculate my footprint <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tips"
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Explore tips
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">What is a carbon footprint?</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              The invisible weight of our daily choices.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A carbon footprint is the total amount of greenhouse gases — mostly CO₂ — released by your activities: how you travel, the energy you use at home, the food you eat, and the things you buy.
            </p>
            <p className="mt-3 text-muted-foreground">
              Measured in kilograms of CO₂-equivalent, it's the simplest way to see your impact on the climate and where small changes can make the biggest difference.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Globe2, label: "Average global footprint", value: "~4.7 t", sub: "CO₂ per person / year" },
              { icon: Factory, label: "Goal for 1.5°C", value: "< 2.3 t", sub: "CO₂ per person / year" },
              { icon: Trees, label: "Trees to offset 1 t CO₂", value: "~45", sub: "mature trees / year" },
              { icon: Droplets, label: "Energy = emissions", value: "73%", sub: "of all global CO₂" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border bg-card p-5 shadow-sm">
                <s.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-2xl font-bold tracking-tight">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-xs text-muted-foreground/70">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why it matters</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Climate change is personal — and so is the solution.</h2>
            <p className="mt-4 text-muted-foreground">
              Every tonne of CO₂ avoided slows warming, protects ecosystems, and keeps our cities livable. Awareness is the first step toward action.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: TrendingDown, title: "Reduce emissions", body: "Knowing your number reveals the easiest, biggest reductions you can make." },
              { icon: Sparkles, title: "Build better habits", body: "Track monthly progress and celebrate the changes that stick." },
              { icon: Trees, title: "Protect what we love", body: "Cleaner air, thriving forests, and a stable climate for future generations." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border bg-card p-6 shadow-sm">
                <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="overflow-hidden rounded-3xl border bg-card p-8 shadow-sm sm:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to see your number?</h2>
              <p className="mt-2 text-muted-foreground">It takes less than a minute. No sign-up. Your data stays in your browser.</p>
            </div>
            <Link
              to="/calculator"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
            >
              Start calculating <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
