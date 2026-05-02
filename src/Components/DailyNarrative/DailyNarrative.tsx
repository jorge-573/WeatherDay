import { Paragraph, SectionTitle } from '../shared/typography'
import { Divider, Wrapper } from './DailyNarrative.styles'

export function DailyNarrative() {
  return (
    <Wrapper>
      <SectionTitle>Daily Narrative</SectionTitle>
      <Paragraph>
        Today: Increasing clouds through the afternoon with a peak temperature near 76 and light winds from the
        northwest.
      </Paragraph>
      <Divider />
      <Paragraph>Tonight: Skies clear after midnight and temperatures cool to around 58 with calm winds.</Paragraph>
      <Divider />
      <Paragraph>Tomorrow: Full sun through the day and a high near 72 with dry conditions.</Paragraph>
    </Wrapper>
  )
}
