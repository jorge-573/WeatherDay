import type { TimeOfDay } from '../../types/timeOfDay'
import { Link, Links, Note, Wrapper } from './AppFooter.styles'

type AppFooterProps = {
  timeOfDay: TimeOfDay
}

const footerLinks = ['Privacy Policy', 'Terms of Service', 'Contact', 'API Access']

export function AppFooter({ timeOfDay }: AppFooterProps) {
  return (
    <Wrapper $timeOfDay={timeOfDay}>
      <Links>
        {footerLinks.map((entry) => (
          <Link key={entry} href="#" $timeOfDay={timeOfDay}>
            {entry}
          </Link>
        ))}
      </Links>
      <Note>Atmospheric Precision | Demo weather skeleton</Note>
    </Wrapper>
  )
}
