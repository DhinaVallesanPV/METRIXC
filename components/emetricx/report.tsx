"use client"

import type { CarbonInputs, Offsets } from "./emetricx-app"

type Category = "Organization" | "Mining" | null

export default function Report({
  category,
  inputs,
  offsets,
  totals,
  onBack,
}: {
  category: Category
  inputs: CarbonInputs
  offsets: Offsets
  totals: { emissions: number; offsets: number; gap: number }
  onBack: () => void
}) {
  const handleDownloadReport = () => {
    const lines = [
      "E-METRICX Report",
      `Date: ${new Date().toLocaleString()}`,
      "",
      `Category: ${category ?? "-"}`,
      "",
      "Totals:",
      `- Emissions: ${totals.emissions.toFixed(2)} t`,
      `- Offsets: ${totals.offsets.toFixed(2)} t`,
      `- Neutrality Gap: ${totals.gap.toFixed(2)} t`,
      "",
      "Inputs:",
      `- Electricity: ${inputs.electricity} kWh`,
      `- Transport: ${inputs.transport} km`,
      `- Fuel: ${inputs.fuel} L`,
      `- Waste: ${inputs.waste} kg`,
      ...(category === "Mining" ? [`- Coal Transport: ${inputs.coalTransport ?? 0} ton-km`] : []),
      "",
      "Offsets:",
      `- Afforestation: ${offsets.afforestation} t`,
      `- Renewables: ${offsets.renewables} t`,
      `- Carbon Credits: ${offsets.carbonCredits} t`,
    ]
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `emetricx-report-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Summary Report</h2>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-background p-4">
          <h3 className="mb-2 text-sm font-medium text-foreground">Profile</h3>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            <li>
              Category: <span className="text-foreground">{category ?? "-"}</span>
            </li>
          </ul>
        </div>

        <div className="rounded-md border border-border bg-background p-4">
          <h3 className="mb-2 text-sm font-medium text-foreground">Totals</h3>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            <li>
              Emissions: <span className="text-foreground">{totals.emissions.toFixed(2)} t</span>
            </li>
            <li>
              Offsets: <span className="text-foreground">{totals.offsets.toFixed(2)} t</span>
            </li>
            <li>
              Neutrality Gap: <span className="text-foreground">{totals.gap.toFixed(2)} t</span>
            </li>
          </ul>
        </div>

        <div className="rounded-md border border-border bg-background p-4">
          <h3 className="mb-2 text-sm font-medium text-foreground">Inputs</h3>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            <li>
              Electricity: <span className="text-foreground">{inputs.electricity} kWh</span>
            </li>
            <li>
              Transport: <span className="text-foreground">{inputs.transport} km</span>
            </li>
            <li>
              Fuel: <span className="text-foreground">{inputs.fuel} L</span>
            </li>
            <li>
              Waste: <span className="text-foreground">{inputs.waste} kg</span>
            </li>
            {category === "Mining" && (
              <li>
                Coal Transport: <span className="text-foreground">{inputs.coalTransport ?? 0} ton-km</span>
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-md border border-border bg-background p-4">
          <h3 className="mb-2 text-sm font-medium text-foreground">Offsets</h3>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            <li>
              Afforestation: <span className="text-foreground">{offsets.afforestation} t</span>
            </li>
            <li>
              Renewables: <span className="text-foreground">{offsets.renewables} t</span>
            </li>
            <li>
              Carbon Credits: <span className="text-foreground">{offsets.carbonCredits} t</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-md border border-border bg-background p-4">
        <h3 className="mb-2 text-sm font-medium text-foreground">Decision Insights</h3>
        <p className="text-sm text-muted-foreground">
          {totals.gap <= 0
            ? "You have achieved carbon neutrality or better. Maintain offsets and continue monitoring."
            : "Consider increasing renewable investments, expanding afforestation, or acquiring verified credits to close the neutrality gap."}
        </p>
      </section>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-md border border-border bg-card px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Back
        </button>
        <button
          onClick={handleDownloadReport}
          className="rounded-md border border-border bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
        >
          Download report
        </button>
      </div>
    </div>
  )
}
