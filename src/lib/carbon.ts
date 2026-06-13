// Carbon footprint calculation utilities
// Emission factors (kg CO2)

export type Transport = "car" | "bus" | "train" | "bike" | "walking";
export type Food = "vegetarian" | "mixed" | "non-vegetarian";

export interface CalculatorInput {
  dailyKm: number;
  transport: Transport;
  monthlyKwh: number;
  food: Food;
}

export interface FootprintResult {
  travel: number; // kg CO2 / month
  electricity: number;
  food: number;
  total: number;
  category: "Low" | "Medium" | "High";
  topSource: "travel" | "electricity" | "food";
}

const TRANSPORT_FACTOR: Record<Transport, number> = {
  car: 0.192, // kg CO2 per km
  bus: 0.089,
  train: 0.041,
  bike: 0,
  walking: 0,
};

const FOOD_MONTHLY: Record<Food, number> = {
  vegetarian: 100,
  mixed: 175,
  "non-vegetarian": 270,
};

const ELECTRICITY_FACTOR = 0.42; // kg CO2 per kWh (global avg)

export function calculateFootprint(input: CalculatorInput): FootprintResult {
  const travel = Math.max(0, input.dailyKm) * TRANSPORT_FACTOR[input.transport] * 30;
  const electricity = Math.max(0, input.monthlyKwh) * ELECTRICITY_FACTOR;
  const food = FOOD_MONTHLY[input.food];
  const total = travel + electricity + food;

  let category: FootprintResult["category"] = "Low";
  if (total > 600) category = "High";
  else if (total > 300) category = "Medium";

  const sources = { travel, electricity, food } as const;
  const topSource = (Object.entries(sources).sort((a, b) => b[1] - a[1])[0][0]) as FootprintResult["topSource"];

  return { travel, electricity, food, total, category, topSource };
}

export function generateInsights(input: CalculatorInput, result: FootprintResult): string[] {
  const tips: string[] = [];
  if (result.topSource === "travel") {
    if (input.transport === "car") {
      tips.push("Switch to train or bus for daily commutes — it can cut travel emissions by up to 70%.");
      tips.push("Try carpooling or biking for trips under 5 km.");
    } else if (input.transport === "bus") {
      tips.push("Combine bus with cycling for first/last-mile journeys to reduce overall emissions.");
    } else {
      tips.push("Plan trips together to reduce total distance traveled each week.");
    }
  }
  if (result.topSource === "electricity" || input.monthlyKwh > 250) {
    tips.push("Switch to LED lighting and unplug devices on standby — saves up to 15% on electricity.");
    tips.push("Use a programmable thermostat and lower heating/cooling by 1–2°C.");
    tips.push("Consider a renewable-energy tariff from your utility provider.");
  }
  if (result.topSource === "food" || input.food === "non-vegetarian") {
    tips.push("Try 2–3 plant-based meals a week — a meaningful and easy reduction.");
    tips.push("Choose local and seasonal produce to lower food-mile emissions.");
    tips.push("Reduce food waste by planning meals and storing leftovers properly.");
  }
  if (input.transport === "bike" || input.transport === "walking") {
    tips.push("You're already commuting clean — share your routine with others to inspire change!");
  }
  if (tips.length === 0) {
    tips.push("You're doing great! Keep tracking monthly to spot new opportunities.");
  }
  return tips;
}

export interface SavedRecord extends CalculatorInput {
  id: string;
  date: string; // ISO
  result: FootprintResult;
}

const STORAGE_KEY = "carbon-records-v1";

export function loadRecords(): SavedRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedRecord[];
  } catch {
    return [];
  }
}

export function saveRecord(record: SavedRecord): SavedRecord[] {
  const all = [...loadRecords(), record].slice(-50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return all;
}

export function clearRecords() {
  localStorage.removeItem(STORAGE_KEY);
}

export function sampleRecords(): SavedRecord[] {
  const samples: CalculatorInput[] = [
    { dailyKm: 30, transport: "car", monthlyKwh: 320, food: "non-vegetarian" },
    { dailyKm: 25, transport: "car", monthlyKwh: 280, food: "mixed" },
    { dailyKm: 18, transport: "bus", monthlyKwh: 260, food: "mixed" },
    { dailyKm: 12, transport: "bus", monthlyKwh: 220, food: "mixed" },
    { dailyKm: 8, transport: "bike", monthlyKwh: 200, food: "vegetarian" },
  ];
  const now = Date.now();
  return samples.map((s, i) => {
    const date = new Date(now - (samples.length - 1 - i) * 1000 * 60 * 60 * 24 * 30).toISOString();
    return {
      ...s,
      id: `sample-${i}`,
      date,
      result: calculateFootprint(s),
    };
  });
}