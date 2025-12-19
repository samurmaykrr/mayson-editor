import { describe, it, expect, vi } from 'vitest'
import { render, screen, userEvent } from '../test-utils'
import { Input } from '../../src/components/ui/Input'

describe('Input Component', () => {
  it('renders input field', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText(/enter text/i)
    expect(input).toBeInTheDocument()
  })

  it('updates value on user input', async () => {
    render(<Input />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    await userEvent.type(input, 'test value')
    expect(input.value).toBe('test value')
  })

  it('calls onChange handler', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'a')
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders with error state', () => {
    render(<Input error={true} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-error')
  })

  it('renders with icon', () => {
    render(<Input icon={<span data-testid="test-icon">🔍</span>} />)
    const icon = screen.getByTestId('test-icon')
    expect(icon).toBeInTheDocument()
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('pl-8')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" />)
    let input = screen.getByRole('textbox') as HTMLInputElement
    expect(input.type).toBe('email')

    rerender(<Input type="password" />)
    // Password inputs are not accessible via textbox role
    input = document.querySelector('input[type="password"]') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.type).toBe('password')

    rerender(<Input type="number" />)
    input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.type).toBe('number')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLInputElement | null }
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('accepts custom className', () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('has focus styles', () => {
    render(<Input />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('focus:ring-2')
  })
})
