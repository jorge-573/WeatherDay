import { Brand, Copyright, Link, Links, Wrapper } from './Footer.styles'

const footerLinks = [
  'Privacy Policy',
  'Terms of Service',
  'Contact',
  'API Access',
]

export function Footer() {
  return (
    <Wrapper>
      <Links>
        {footerLinks.map((entry) => (
          <Link key={entry} href="#">
            {entry}
          </Link>
        ))}
      </Links>
      <Brand>WeatherDay</Brand>
      <Copyright>
        © 2024 WeatherDay. Data provided by Ethereal Observer Labs.
      </Copyright>
    </Wrapper>
  )
}
