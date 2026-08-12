import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import type { VisibilityClarity } from './visibilityScale'

const FAR_TERRAIN = 'M 5 72 L 23 49 L 38 62 L 54 41 L 72 65 L 90 51 L 105 69 L 105 90 L 5 90 Z'
const MID_TERRAIN = 'M 5 80 L 24 63 L 39 72 L 58 56 L 77 74 L 94 62 L 105 74 L 105 90 L 5 90 Z'
const NEAR_TERRAIN = 'M 5 86 Q 20 72 35 80 Q 51 67 65 81 Q 83 70 105 83 L 105 91 L 5 91 Z'

const FAR_OPACITY = [0.04, 0.1, 0.22, 0.42, 0.68]
const MID_OPACITY = [0.1, 0.22, 0.42, 0.62, 0.82]
const FOG_BANDS = [48, 59, 70]

type VisibilitySceneProps = {
  clarity: VisibilityClarity
}

export function VisibilityScene({ clarity }: VisibilitySceneProps) {
  const theme = useTheme()

  return (
    <Box
      component="svg"
      viewBox="0 0 110 100"
      aria-hidden
      sx={{ display: 'block', width: 102, height: 92, flexShrink: 0 }}
    >
      <circle cx={83} cy={23} r={8} fill={theme.md3.tertiaryFixedDim} opacity={0.08 + clarity * 0.2} />
      <line
        x1={7}
        y1={38}
        x2={103}
        y2={38}
        stroke={theme.md3.accent}
        strokeWidth={1.5}
        opacity={0.08 + clarity * 0.16}
      />

      <path
        d={FAR_TERRAIN}
        fill={theme.md3.accent}
        stroke={theme.md3.accent}
        strokeWidth={1}
        strokeLinejoin="round"
        opacity={FAR_OPACITY[clarity]}
      />
      <path
        d={MID_TERRAIN}
        fill={theme.md3.primaryFixedDim}
        stroke={theme.md3.primaryFixedDim}
        strokeWidth={1}
        strokeLinejoin="round"
        opacity={MID_OPACITY[clarity]}
      />
      <path
        d={NEAR_TERRAIN}
        fill={theme.md3.surfaceBright}
        stroke={theme.palette.text.primary}
        strokeWidth={1.5}
        strokeLinejoin="round"
        opacity={0.9}
      />

      {FOG_BANDS.map((y, index) => (
        <line
          key={y}
          x1={12 + index * 5}
          y1={y}
          x2={98 - index * 4}
          y2={y}
          stroke={theme.palette.text.secondary}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={Math.max(0.06, 0.58 - clarity * 0.13 - index * 0.05)}
        />
      ))}
    </Box>
  )
}
