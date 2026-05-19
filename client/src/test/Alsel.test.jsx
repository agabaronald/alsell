import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Alsel from '../Alsel'

describe('Alsel', () => {
  it('renders the marketplace heading', () => {
    render(<Alsel />)
    expect(screen.getByText(/alsel/i)).toBeInTheDocument()
  })
})
