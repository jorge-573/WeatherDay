import type { UnitSystem } from '../../config/units'
import { Option, Toggle } from './UnitToggle.styles'

type UnitToggleProps = {
  units: UnitSystem
  onChange: (units: UnitSystem) => void
}

export function UnitToggle({ units, onChange }: UnitToggleProps) {
  return (
    <Toggle role="group" aria-label="Temperature units">
      <Option
        type="button"
        $active={units === 'imperial'}
        aria-pressed={units === 'imperial'}
        onClick={() => onChange('imperial')}
      >
        °F
      </Option>
      <Option
        type="button"
        $active={units === 'metric'}
        aria-pressed={units === 'metric'}
        onClick={() => onChange('metric')}
      >
        °C
      </Option>
    </Toggle>
  )
}
