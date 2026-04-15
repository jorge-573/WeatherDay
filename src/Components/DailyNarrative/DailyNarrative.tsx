import type { TimeOfDay } from '../../types/timeOfDay'
import { Divider, Paragraph, Title, Wrapper } from './DailyNarrative.styles'

type DailyNarrativeProps = {
  timeOfDay: TimeOfDay
}

export function DailyNarrative({ timeOfDay }: DailyNarrativeProps) {
  return (
    <Wrapper $timeOfDay={timeOfDay}>
      <Title>Daily Narrative</Title>
      <Paragraph>
        Today: Increasing clouds through the afternoon with a peak temperature near 76 and light winds from the
        northwest.
      </Paragraph>
      <Divider $timeOfDay={timeOfDay} />
      <Paragraph>Tonight: Skies clear after midnight and temperatures cool to around 58 with calm winds.</Paragraph>
      <Divider $timeOfDay={timeOfDay} />
      <Paragraph>Tomorrow: Full sun through the day and a high near 72 with dry conditions.</Paragraph>
    </Wrapper>
  )
}
