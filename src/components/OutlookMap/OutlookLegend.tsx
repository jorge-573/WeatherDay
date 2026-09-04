import { Fragment } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CIG_LEGEND_LABELS, isCigLegendLabel } from '../../config/outlooks'
import type { OutlookLayerDetails, OutlookLegendItem } from '../../types/outlooks'
import { MAP_PANEL_SX } from '../WeatherMap/panel'

type OutlookLegendProps = {
  title: string
  details: OutlookLayerDetails | null
  loading: boolean
  error: string | null
}

const SWATCH_WELL_SX = {
  width: 22,
  height: 22,
  flexShrink: 0,
  borderRadius: 0.5,
  bgcolor: '#eef2f6',
  overflow: 'hidden',
  border: '1px solid rgba(255,255,255,0.16)',
} as const

const CIG_HATCH: Record<string, string> = {
  CIG1: 'repeating-linear-gradient(-45deg, #1b1f24 0 1.5px, transparent 1.5px 5px)',
  CIG2: 'repeating-linear-gradient(45deg, #1b1f24 0 1.5px, transparent 1.5px 5px)',
  CIG3: [
    'repeating-linear-gradient(-45deg, #1b1f24 0 1.5px, transparent 1.5px 5px)',
    'repeating-linear-gradient(45deg, #1b1f24 0 1.5px, transparent 1.5px 5px)',
  ].join(', '),
}

function formatTime(value: string | number | null): string | null {
  if (value === null) return null
  const compactUtc = typeof value === 'string' ? value.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/) : null
  const normalizedValue = compactUtc
    ? Date.UTC(
        Number(compactUtc[1]),
        Number(compactUtc[2]) - 1,
        Number(compactUtc[3]),
        Number(compactUtc[4]),
        Number(compactUtc[5])
      )
    : value
  if (typeof normalizedValue === 'string' && Number.isNaN(Date.parse(normalizedValue))) return normalizedValue

  const date = new Date(normalizedValue)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

function legendLabel(label: string): string {
  return CIG_LEGEND_LABELS[label] || label || 'Forecast area'
}

function LegendSwatch({ item }: { item: OutlookLegendItem }) {
  if (isCigLegendLabel(item.label)) {
    return (
      <Box
        aria-hidden
        sx={{
          ...SWATCH_WELL_SX,
          backgroundImage: CIG_HATCH[item.label],
        }}
      />
    )
  }

  return (
    <Box sx={SWATCH_WELL_SX}>
      <Box
        component="img"
        src={`data:${item.contentType};base64,${item.imageData}`}
        alt=""
        sx={{ display: 'block', width: '100%', height: '100%' }}
      />
    </Box>
  )
}

export function OutlookLegend({ title, details, loading, error }: OutlookLegendProps) {
  const validTime = formatTime(details?.validTime ?? null)
  const expireTime = formatTime(details?.expireTime ?? null)
  const firstCigIndex = details?.legend.findIndex((item) => isCigLegendLabel(item.label)) ?? -1

  return (
    <Box
      sx={{
        width: { xs: 176, sm: 220 },
        maxHeight: { xs: 220, sm: 360 },
        overflowY: 'auto',
        px: 1.5,
        py: 1.25,
        ...MAP_PANEL_SX,
      }}
    >
      <Typography variant="overline" sx={{ display: 'block', fontWeight: 800, lineHeight: 1.4 }}>
        {title}
      </Typography>

      {loading ? (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
          <CircularProgress size={14} />
          <Typography variant="caption" color="text.secondary">
            Loading details…
          </Typography>
        </Stack>
      ) : error ? (
        <Typography variant="caption" color="text.secondary">
          Legend unavailable
        </Typography>
      ) : (
        <>
          {details?.legend.length ? (
            <Stack spacing={0.75} sx={{ mt: 1 }}>
              {details.legend.map((item, index) => (
                <Fragment key={`${item.label}-${item.imageData}`}>
                  {index === firstCigIndex && (
                    <Typography
                      variant="overline"
                      sx={{
                        display: 'block',
                        pt: 0.5,
                        color: 'text.secondary',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        lineHeight: 1.4,
                      }}
                    >
                      Conditional intensity
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LegendSwatch item={item} />
                    <Typography variant="caption" sx={{ lineHeight: 1.2, fontWeight: 600 }}>
                      {legendLabel(item.label)}
                    </Typography>
                  </Stack>
                </Fragment>
              ))}
            </Stack>
          ) : (
            <Typography variant="caption" color="text.secondary">
              Official SPC colors
            </Typography>
          )}

          {(validTime || expireTime) && (
            <Stack spacing={0.25} sx={{ mt: 1.25, pt: 1, borderTop: 1, borderColor: 'divider' }}>
              {validTime && (
                <Typography variant="caption" color="text.secondary">
                  Valid: {validTime}
                </Typography>
              )}
              {expireTime && (
                <Typography variant="caption" color="text.secondary">
                  Until: {expireTime}
                </Typography>
              )}
            </Stack>
          )}
        </>
      )}
    </Box>
  )
}
