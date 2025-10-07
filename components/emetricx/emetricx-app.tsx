"use client"

import { useEffect, useMemo, useState } from "react"
import UserCategory from "./user-category"
import DataInputForm from "./data-input-form"
import CarbonSink from "./carbon-sink"
import GapAnalysis from "./gap-analysis"
import Visualization from "./visualization"
import Report from "./report"
import { calculateCO2e, computeTotals } from "@/utils/carbon-engine"

type Category = "Organization" | "Mining"

export interface CarbonInputs {
  electricity: number
  transport: number
  fuel: number
  waste: number
  coalTransport?: number
}

export interface Offsets {
  afforestation: number
  renewables: number
  carbonCredits: number
}

export interface CarbonData {
  category: Category | null
  inputs: CarbonInputs
  offsets: Offsets
  totals: {
    emissions: number
    offsets: number
    gap: number
  }
}

const STORAGE_KEY = "carbonData"

const defaultInputs: CarbonInputs = {
  electricity: 0,
  transport: 0,
  fuel: 0,
  waste: 0,
  coalTransport: 0,
}

const defaultOffsets: Offsets = {
  afforestation: 0,
  renewables: 0,
  carbonCredits: 0,
}

export default function EmetricxApp() {
  const [step, setStep] = useState<number>(0)
  const [data, setData] = useState<CarbonData>({
    category: null,
    inputs: defaultInputs,
    offsets: defaultOffsets,
    totals: { emissions: 0, offsets: 0, gap: 0 },
  })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as CarbonData
        setData(parsed)
        // If category exists, resume from where user likely left off
        setStep(parsed.category ? 1 : 0)
      }
    } catch {
      // Ignore malformed storage
    }
  }, [])

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
  }, [data])

  const onSelectCategory = (category: Category) => {
    setData((prev) => ({ ...prev, category }))
    setStep(1)
  }

  const onSaveInputs = (inputs: CarbonInputs) => {
    const emissions = Number(calculateCO2e(inputs))
    const totals = computeTotals({ inputs, offsets: data.offsets, emissions })
    setData((prev) => ({
      ...prev,
      inputs,
      totals,
    }))
    setStep(2)
  }

  const onSaveOffsets = (offsets: Offsets) => {
    const emissions = Number(calculateCO2e(data.inputs))
    const totals = computeTotals({ inputs: data.inputs, offsets, emissions })
    setData((prev) => ({
      ...prev,
      offsets,
      totals,
    }))
    setStep(3)
  }

  const resetAll = () => {
    setData({
      category: null,
      inputs: defaultInputs,
      offsets: defaultOffsets,
      totals: { emissions: 0, offsets: 0, gap: 0 },
    })
    setStep(0)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const steps = useMemo(
    () => [
      { title: "Category", idx: 0 },
      { title: "Data Input", idx: 1 },
      { title: "Offsets", idx: 2 },
      { title: "Gap Analysis", idx: 3 },
      { title: "Visualize", idx: 4 },
      { title: "Report", idx: 5 },
    ],
    [],
  )

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 rounded-xl border bg-card/80 shadow-lg backdrop-blur-sm">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-pretty text-2xl font-semibold text-foreground text-left italic overline">
                                       E-METRICX 
        </h1>
        <button
          onClick={resetAll}
          className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Reset
        </button>
      </header>

      {/* Stepper */}
      <nav className="mb-8 grid grid-cols-3 gap-2 md:grid-cols-6">
        {steps.map((s, i) => {
          const isActive = i === step
          const isDone = i < step
          return (
            <button
              key={s.idx}
              onClick={() => setStep(i)}
              className={[
                "rounded-md border px-2 py-2 text-xs transition",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : isDone
                    ? "border-border bg-muted text-muted-foreground"
                    : "border-border bg-card text-foreground",
              ].join(" ")}
              aria-current={isActive ? "step" : undefined}
            >
              {s.title}
            </button>
          )
        })}
      </nav>

      {/* Steps */}
      <section className="space-y-6">
        {step === 0 && (
          <UserCategory
            value={data.category}
            onSelect={(c) => onSelectCategory(c as Category)}
            onNext={() => setStep(1)}
          />
        )}

        {step === 1 && (
          <DataInputForm
            category={data.category}
            initialValues={data.inputs}
            onBack={() => setStep(0)}
            onSave={onSaveInputs}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <CarbonSink
            initialValues={data.offsets}
            onBack={() => setStep(1)}
            onSave={onSaveOffsets}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && <GapAnalysis totals={data.totals} onBack={() => setStep(2)} onNext={() => setStep(4)} />}

        {step === 4 && (
          <Visualization
            category={data.category}
            inputs={data.inputs}
            offsets={data.offsets}
            totals={data.totals}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
          />
        )}

        {step === 5 && (
          <Report
            category={data.category}
            inputs={data.inputs}
            offsets={data.offsets}
            totals={data.totals}
            onBack={() => setStep(4)}
          />
        )}
      </section>
    </main>
  )
}
