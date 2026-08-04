import { NOAA_ATTRIBUTION } from '../../services/noaaRadar'
import type { RadarSource } from '../../types/radar'
import { RAINVIEWER_ATTRIBUTION } from '../../services/rainviewer'

export type LegendRow = {
  label: string
  /** Light -> heavy color stops, matched to the source's tile palette. */
  gradient: string
}

type SourceMeta = {
  label: string
  /** Coverage summary, read out by screen readers on the toggle. */
  description: string
  attribution: string
  legend: LegendRow[]
}

export const SOURCE_META: Record<RadarSource, SourceMeta> = {
  noaa: {
    label: 'NOAA',
    description: 'NOAA MRMS radar, United States only',
    attribution: NOAA_ATTRIBUTION,
    // The NWS reflectivity scale MRMS renders with: one intensity ramp covering
    // every precipitation type rather than separate rain and snow ramps.
    legend: [
      {
        label: 'Reflectivity',
        gradient:
          'linear-gradient(to right, #04e9e7, #019ff4, #0300f4, #02fd02, #01c501, #008e00, #fdf802, #e5bc00, #fd9500, #fd0000, #d40000, #bc0000, #f800fd, #9854c6)',
      },
    ],
  },
  rainviewer: {
    label: 'RainViewer',
    description: 'RainViewer radar, worldwide',
    attribution: RAINVIEWER_ATTRIBUTION,
    // Stops from RainViewer's official color table for the "Universal Blue"
    // scheme: rain cyan -> blue -> yellow -> red, snow in its own palette.
    legend: [
      {
        label: 'Rain',
        gradient: 'linear-gradient(to right, #88ddee, #00a3e0, #005588, #ffee00, #ffaa00, #ff4400, #c10000)',
      },
      {
        label: 'Snow',
        gradient: 'linear-gradient(to right, #bfffff, #9fdfff, #7fbfff, #4f8fff, #2f6fff, #0f4fff)',
      },
    ],
  },
}

/** Display order for the source toggle. */
export const SOURCE_ORDER: RadarSource[] = ['noaa', 'rainviewer']
