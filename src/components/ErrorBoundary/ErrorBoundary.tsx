import { Component, type ErrorInfo, type ReactNode } from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { StatusMessage } from '../shared'

type ErrorBoundaryProps = {
  children: ReactNode
  /** The boundary clears its error whenever this changes, e.g. on navigation. */
  resetKey?: unknown
}

type ErrorBoundaryState = {
  error: Error | null
  resetKey: unknown
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, resetKey: this.props.resetKey }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error }
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState
  ): Partial<ErrorBoundaryState> | null {
    return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
        <StatusMessage inline>Something went wrong showing this page.</StatusMessage>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => this.setState({ error: null })}>
            Try again
          </Button>
          {/* A failed lazy-loaded page (e.g. after a deploy) only recovers with a full reload. */}
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Stack>
      </Stack>
    )
  }
}
