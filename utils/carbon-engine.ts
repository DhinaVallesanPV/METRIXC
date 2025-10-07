export function calculateCO2e(data: {
  electricity?: number
  transport?: number
  fuel?: number
  waste?: number
  coalTransport?: number
}): string {
  const factors = {
    electricity: 0.82,
    transport: 2.3,
    fuel: 2.5,
    waste: 1.7,
    coalTransport: 3.0,
  }
  let total = 0
  for (const key in data) {
    const typedKey = key as keyof typeof factors
    if (typedKey in factors) {
      const v = Number.parseFloat(String(data[typedKey] ?? 0))
      if (Number.isFinite(v)) total += v * (factors[typedKey] as number)
    }
  }
  return total.toFixed(2)
}

export function computeTotals({
  inputs,
  offsets,
  emissions,
}: {
  inputs: {
    electricity?: number
    transport?: number
    fuel?: number
    waste?: number
    coalTransport?: number
  }
  offsets: { afforestation?: number; renewables?: number; carbonCredits?: number }
  emissions?: number
}) {
  const em = Number.isFinite(emissions as number) ? (emissions as number) : Number(calculateCO2e(inputs))

  const off = (offsets.afforestation || 0) + (offsets.renewables || 0) + (offsets.carbonCredits || 0)

  const gap = Math.max(em - off, 0)
  return { emissions: em, offsets: off, gap }
}
