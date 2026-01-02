import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoadingSpinner from '../components/LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading text', () => {
    render(<LoadingSpinner text="Loading..." />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders without text', () => {
    render(<LoadingSpinner text="" />)
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
})
