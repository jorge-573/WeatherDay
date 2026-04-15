import type { TimeOfDay } from '../../types/timeOfDay'
import { Heading, Item, Menu, Subheading, Wrapper } from './Sidebar.styles'

type SidebarProps = {
  timeOfDay: TimeOfDay
}

const sections = ['Current', 'Hourly', '7-Day', 'Details']

export function Sidebar({ timeOfDay }: SidebarProps) {
  return (
    <Wrapper $timeOfDay={timeOfDay}>
      <div>
        <Heading>Sky Observer</Heading>
        <Subheading>Local weather</Subheading>
      </div>

      <Menu>
        {sections.map((entry) => (
          <Item key={entry} $timeOfDay={timeOfDay} $active={entry === 'Current'}>
            {entry}
          </Item>
        ))}
      </Menu>
    </Wrapper>
  )
}
