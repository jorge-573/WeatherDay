import AcUnitIcon from '@mui/icons-material/AcUnit'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { getWeatherCondition } from '../../domain/weatherCodes'

const SIZES = {
  sm: { icon: 12, fontSize: '0.65rem' },
  md: { icon: 13, fontSize: undefined },
} as const

type PrecipitationBadgeProps = {
  code: number
  probability: number | null
  size?: keyof typeof SIZES
  /** Holds the row height when there is no probability, so sibling columns stay aligned. */
  reserveSpace?: boolean
}

export function PrecipitationBadge({ code, probability, size = 'md', reserveSpace = false }: PrecipitationBadgeProps) {
  if (probability === null && !reserveSpace) return null

  const { icon, fontSize } = SIZES[size]
  const isSnow = getWeatherCondition(code).group === 'snow'

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.25}
      sx={{
        color: probability ? (t) => t.md3.accent : 'text.disabled',
        ...(reserveSpace && { minHeight: 16 }),
      }}
    >
      {probability !== null && (
        <>
          {isSnow ? <AcUnitIcon sx={{ fontSize: icon }} /> : <WaterDropOutlinedIcon sx={{ fontSize: icon }} />}
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize }}>
            {probability}%
          </Typography>
        </>
      )}
    </Stack>
  )
}
