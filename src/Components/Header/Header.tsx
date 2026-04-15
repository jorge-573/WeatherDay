import type { TimeOfDay } from '../../types/timeOfDay'
import { formatTimeOfDayLabel } from '../../utils/getTimeOfDay'
import { Actions, Brand, Link, Nav, Wrapper } from './Header.styles'

type HeaderProps = {
  timeOfDay: TimeOfDay
}

const links = ['Forecast', 'Maps', 'Air Quality', 'History']

export function Header({ timeOfDay }: HeaderProps) {
  return (
    <Wrapper $timeOfDay={timeOfDay}>
      <Brand>Atmospheric Precision</Brand>
      <Nav>
        {links.map((entry) => (
          <Link key={entry} href="#" $timeOfDay={timeOfDay}>
            {entry}
          </Link>
        ))}
      </Nav>
      <Actions $timeOfDay={timeOfDay}>San Francisco, CA | {formatTimeOfDayLabel(timeOfDay)}</Actions>
    </Wrapper>
  )
}
