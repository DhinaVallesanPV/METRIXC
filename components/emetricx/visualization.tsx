"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"
import type { CarbonInputs, Offsets } from "./emetricx-app"

type Category = "Organization" | "Mining" | null

export default function Visualization({
  category,
  inputs,
  offsets,
  totals,
  onBack,
  onNext,
}: {
  category: Category
  inputs: CarbonInputs
  offsets: Offsets
  totals: { emissions: number; offsets: number; gap: number }
  onBack: () => void
  onNext: () => void
}) {
  const emissionData = [
    { name: "Electricity", value: inputs.electricity || 0 },
    { name: "Transport", value: inputs.transport || 0 },
    { name: "Fuel", value: inputs.fuel || 0 },
    { name: "Waste", value: inputs.waste || 0 },
    ...(category === "Mining" ? [{ name: "Coal Transport", value: inputs.coalTransport || 0 }] : []),
  ]

  const offsetData = [
    { name: "Afforestation", value: offsets.afforestation || 0 },
    { name: "Renewables", value: offsets.renewables || 0 },
    { name: "Credits", value: offsets.carbonCredits || 0 },
  ]

  const gapData = [
    { name: "Emissions", value: totals.emissions },
    { name: "Offsets", value: totals.offsets },
    { name: "Gap", value: totals.gap },
  ]

  const chartColors = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ]

  const categoryColorMap: Record<string, string> = {
    Electricity: "var(--color-chart-1)",
    Transport: "var(--color-chart-2)",
    Fuel: "var(--color-chart-3)",
    Waste: "var(--color-chart-4)",
    "Coal Transport": "var(--color-chart-5)",
  }

  const metricColorMap: Record<string, string> = {
    Emissions: "var(--color-chart-1)",
    Offsets: "var(--color-chart-2)",
    Gap: "var(--color-chart-3)",
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Visualization</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 rounded-md border border-border bg-background p-2">
          <h3 className="mb-2 text-sm font-medium text-foreground">Emission Category Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie dataKey="value" data={emissionData} outerRadius={80} label isAnimationActive={false}>
                {emissionData.map((d, index) => (
                  <Cell key={d.name} fill={categoryColorMap[d.name] || chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64 rounded-md border border-border bg-background p-2">
          <h3 className="mb-2 text-sm font-medium text-foreground">Emissions vs Offsets</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart
              data={[
                { name: "Current", Emissions: totals.emissions, Offsets: totals.offsets },
                { name: "Target", Emissions: 0, Offsets: totals.emissions },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Emissions" stroke="var(--color-chart-1)" />
              <Line type="monotone" dataKey="Offsets" stroke="var(--color-chart-2)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64 rounded-md border border-border bg-background p-2 md:col-span-2">
          <h3 className="mb-2 text-sm font-medium text-foreground">Neutrality Gap</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={gapData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {gapData.map((d, i) => (
                  <Cell key={d.name} fill={metricColorMap[d.name] || chartColors[i % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-md border border-border bg-card px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="rounded-md border border-border bg-primary px-4 py-2 text-primary-foreground"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
