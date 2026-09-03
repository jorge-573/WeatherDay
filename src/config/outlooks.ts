import type {
  SpcDay,
  SpcLayerDefinition,
  SpcOutlookType,
  TemperatureDay,
  TemperatureKind,
  TemperatureLayerDefinition,
} from '../types/outlooks'

export const SPC_DAYS: SpcDay[] = [1, 2, 3, 4, 5, 6, 7, 8]
export const TEMPERATURE_DAYS: TemperatureDay[] = [1, 2, 3]

export const SPC_TYPE_LABELS: Record<SpcOutlookType, string> = {
  categorical: 'Categorical',
  probabilistic: 'Probabilistic',
  tornado: 'Tornado',
  wind: 'Wind',
  hail: 'Hail',
}

export const SPC_LAYERS: Record<SpcDay, Partial<Record<SpcOutlookType, SpcLayerDefinition>>> = {
  1: {
    categorical: { layerId: 1, label: 'Day 1 Categorical Outlook' },
    tornado: { layerId: 3, significantLayerId: 2, label: 'Day 1 Tornado Probability' },
    hail: { layerId: 5, significantLayerId: 4, label: 'Day 1 Hail Probability' },
    wind: { layerId: 7, significantLayerId: 6, label: 'Day 1 Wind Probability' },
  },
  2: {
    categorical: { layerId: 9, label: 'Day 2 Categorical Outlook' },
    tornado: { layerId: 11, significantLayerId: 10, label: 'Day 2 Tornado Probability' },
    hail: { layerId: 13, significantLayerId: 12, label: 'Day 2 Hail Probability' },
    wind: { layerId: 15, significantLayerId: 14, label: 'Day 2 Wind Probability' },
  },
  3: {
    categorical: { layerId: 17, label: 'Day 3 Categorical Outlook' },
    probabilistic: { layerId: 19, significantLayerId: 18, label: 'Day 3 Severe Probability' },
  },
  4: { probabilistic: { layerId: 21, label: 'Day 4 Severe Probability' } },
  5: { probabilistic: { layerId: 22, label: 'Day 5 Severe Probability' } },
  6: { probabilistic: { layerId: 23, label: 'Day 6 Severe Probability' } },
  7: { probabilistic: { layerId: 24, label: 'Day 7 Severe Probability' } },
  8: { probabilistic: { layerId: 25, label: 'Day 8 Severe Probability' } },
}

export const TEMPERATURE_KIND_LABELS: Record<TemperatureKind, string> = {
  high: 'High',
  low: 'Low',
}

export const TEMPERATURE_LAYERS: Record<
  TemperatureKind,
  Partial<Record<TemperatureDay, TemperatureLayerDefinition>>
> = {
  high: {
    1: { layerId: 127, timingLayerId: 126, label: 'Day 1 High Temperature' },
    2: { layerId: 131, timingLayerId: 130, label: 'Day 2 High Temperature' },
    3: { layerId: 135, timingLayerId: 134, label: 'Day 3 High Temperature' },
  },
  low: {
    1: { layerId: 140, timingLayerId: 139, label: 'Day 1 Low Temperature' },
    2: { layerId: 144, timingLayerId: 143, label: 'Day 2 Low Temperature' },
  },
}

export function defaultSpcType(day: SpcDay): SpcOutlookType {
  return day <= 3 ? 'categorical' : 'probabilistic'
}

export function spcTypesForDay(day: SpcDay): SpcOutlookType[] {
  return (Object.keys(SPC_LAYERS[day]) as SpcOutlookType[]).filter((type) => SPC_LAYERS[day][type])
}

export function temperatureDaysForKind(kind: TemperatureKind): TemperatureDay[] {
  return TEMPERATURE_DAYS.filter((day) => TEMPERATURE_LAYERS[kind][day])
}
