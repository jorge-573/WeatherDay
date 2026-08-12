export type VisibilityClarity = 0 | 1 | 2 | 3 | 4

export type VisibilityStatus = {
  label: string
  clarity: VisibilityClarity
}

const LABELS = ['Very poor', 'Poor', 'Moderate', 'Good', 'Excellent'] as const
const IMPERIAL_THRESHOLDS = [0.6, 2.5, 6, 12]
const METRIC_THRESHOLDS = [1, 4, 10, 20]

export function getVisibilityStatus(value: number | null, unit: string): VisibilityStatus {
  if (value === null || Number.isNaN(value)) return { label: 'No data', clarity: 0 }

  const thresholds = unit === 'mi' ? IMPERIAL_THRESHOLDS : METRIC_THRESHOLDS
  const thresholdIndex = thresholds.findIndex((threshold) => value < threshold)
  const clarity = (thresholdIndex === -1 ? 4 : thresholdIndex) as VisibilityClarity

  return { label: LABELS[clarity], clarity }
}
