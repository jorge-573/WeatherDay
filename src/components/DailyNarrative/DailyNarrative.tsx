import { Fragment } from 'react'
import { dailyNarrativeMock } from '../../data/mocks/dailyNarrative'
import { Paragraph, SectionTitle } from '../shared/typography'
import { Divider, Wrapper } from './DailyNarrative.styles'

export function DailyNarrative() {
  return (
    <Wrapper>
      <SectionTitle>Daily Narrative</SectionTitle>
      {dailyNarrativeMock.map((entry, index) => (
        <Fragment key={entry.period}>
          {index > 0 && <Divider />}
          <Paragraph>
            {entry.period}: {entry.body}
          </Paragraph>
        </Fragment>
      ))}
    </Wrapper>
  )
}
