"use client"

import { useState } from "react"

type Category = "Organization" | "Mining"

export default function UserCategory({
  value,
  onSelect,
  onNext,
}: {
  value: Category | null
  onSelect: (category: Category) => void
  onNext: () => void
}) {
  const [selected, setSelected] = useState<Category | null>(value ?? null)

  const proceed = () => {
    if (!selected) return
    onSelect(selected)
    onNext()
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Select User Category</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background p-3">
          <input
            type="radio"
            name="category"
            value="Organization"
            checked={selected === "Organization"}
            onChange={() => setSelected("Organization")}
          />
          <span className="text-foreground">Organization</span>
        </label>

        <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background p-3">
          <input
            type="radio"
            name="category"
            value="Mining"
            checked={selected === "Mining"}
            onChange={() => setSelected("Mining")}
          />
          <span className="text-foreground">Mining</span>
        </label>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={proceed}
          className="rounded-md border border-border bg-primary px-4 py-2 text-primary-foreground"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
