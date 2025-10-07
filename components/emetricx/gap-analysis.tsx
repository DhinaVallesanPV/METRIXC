"use client"

export default function GapAnalysis({
  totals,
  onBack,
  onNext,
}: {
  totals: { emissions: number; offsets: number; gap: number }
  onBack: () => void
  onNext: () => void
}) {
  const { emissions, offsets, gap } = totals
  const status =
    emissions <= 0
      ? "No emissions recorded"
      : gap <= 0
        ? "Carbon Neutral or Net-Negative achieved"
        : "Neutrality gap remains"

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Neutrality Gap Analysis</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total Emissions" value={`${emissions.toFixed(2)} t`} />
        <Stat label="Total Offsets" value={`${offsets.toFixed(2)} t`} />
        <Stat label="Neutrality Gap" value={`${gap.toFixed(2)} t`} />
      </div>

      <div className="mt-4 rounded-md border border-border bg-background p-3">
        <p className="text-sm text-foreground">{status}</p>
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold text-foreground">{value}</p>
    </div>
  )
}
