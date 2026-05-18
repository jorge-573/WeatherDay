import { Fragment } from 'react'
import type { NarrativeEntry } from '../../types/weather'
import { Paragraph, SectionTitle } from '../shared/typography'
import { Divider, Wrapper } from './DailyNarrative.styles'

type DailyNarrativeProps = {
  data: NarrativeEntry[]
}

export function DailyNarrative({ data }: DailyNarrativeProps) {
  return (
    <Wrapper>
      <SectionTitle>Daily Narrative</SectionTitle>
      {data.map((entry, index) => (
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
