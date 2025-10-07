"use client"

import { useEffect, useState } from "react"
import type { CarbonInputs } from "./emetricx-app"
import { calculateCO2e } from "@/utils/carbon-engine"

type Category = "Organization" | "Mining" | null

export default function DataInputForm({
  category,
  initialValues,
  onBack,
  onSave,
  onNext,
}: {
  category: Category
  initialValues: CarbonInputs
  onBack: () => void
  onSave: (inputs: CarbonInputs) => void
  onNext: () => void
}) {
  const [form, setForm] = useState<CarbonInputs>(initialValues)
  const [emissions, setEmissions] = useState<number>(0)

  useEffect(() => {
    setEmissions(Number(calculateCO2e(form)))
  }, [form])

  const update = (key: keyof CarbonInputs, value: string) => {
    const v = Number.parseFloat(value || "0")
    setForm((prev) => ({ ...prev, [key]: Number.isFinite(v) ? v : 0 }))
  }

  const saveAndNext = () => {
    onSave(form)
    onNext()
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Enter Activity Data</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Electricity (kWh)" value={form.electricity} onChange={(v) => update("electricity", v)} />
        <Field label="Transport (km)" value={form.transport} onChange={(v) => update("transport", v)} />
        <Field label="Fuel (L)" value={form.fuel} onChange={(v) => update("fuel", v)} />
        <Field label="Waste (kg)" value={form.waste} onChange={(v) => update("waste", v)} />
        {category === "Mining" && (
          <Field
            label="Coal Transport (ton-km)"
            value={form.coalTransport ?? 0}
            onChange={(v) => update("coalTransport", v)}
          />
        )}
      </div>

      <div className="mt-6 rounded-md border border-border bg-background p-3">
        <p className="text-sm text-muted-foreground">
          Estimated Emissions (CO₂e): <span className="font-semibold text-foreground">{emissions.toFixed(2)} t</span>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-md border border-border bg-card px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Back
        </button>
        <button
          onClick={saveAndNext}
          className="rounded-md border border-border bg-primary px-4 py-2 text-primary-foreground"
        >
          Save & Continue
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: string) => void
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-foreground">{label}</span>
      <input
        type="number"
        step="any"
        className="w-full rounded-md border border-border bg-background p-2 text-foreground"
        value={String(value ?? 0)}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
