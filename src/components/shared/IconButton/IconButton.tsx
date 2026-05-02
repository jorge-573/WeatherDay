import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from './IconButton.styles'

type IconButtonProps = {
  children: ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

export function IconButton({
  children,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <Button type={type} {...props}>
      {children}
    </Button>
  )
}
