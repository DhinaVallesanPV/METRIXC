"use client"

import { useEffect, useState } from "react"
import type { Offsets } from "./emetricx-app"

export default function CarbonSink({
  initialValues,
  onBack,
  onSave,
  onNext,
}: {
  initialValues: Offsets
  onBack: () => void
  onSave: (offsets: Offsets) => void
  onNext: () => void
}) {
  const [form, setForm] = useState<Offsets>(initialValues)
  const [totalOffsets, setTotalOffsets] = useState<number>(0)

  useEffect(() => {
    const total = (form.afforestation || 0) + (form.renewables || 0) + (form.carbonCredits || 0)
    setTotalOffsets(total)
  }, [form])

  const update = (key: keyof Offsets, value: string) => {
    const v = Number.parseFloat(value || "0")
    setForm((prev) => ({ ...prev, [key]: Number.isFinite(v) ? v : 0 }))
  }

  const saveAndNext = () => {
    onSave(form)
    onNext()
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Add Carbon Sinks / Offsets</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="Afforestation (t CO₂e)" value={form.afforestation} onChange={(v) => update("afforestation", v)} />
        <Field label="Renewables (t CO₂e)" value={form.renewables} onChange={(v) => update("renewables", v)} />
        <Field
          label="Carbon Credits (t CO₂e)"
          value={form.carbonCredits}
          onChange={(v) => update("carbonCredits", v)}
        />
      </div>

      <div className="mt-6 rounded-md border border-border bg-background p-3">
        <p className="text-sm text-muted-foreground">
          Total Offsets: <span className="font-semibold text-foreground">{totalOffsets.toFixed(2)} t</span>
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
