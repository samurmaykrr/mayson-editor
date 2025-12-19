import React, { ReactElement } from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Re-export specific items instead of export * to satisfy react-refresh rule
export {
  screen,
  fireEvent,
  waitFor,
  within,
  act,
  cleanup,
} from '@testing-library/react'

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'>

/**
 * Custom render function that wraps components with necessary providers
 */
function render(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>
  }

  return rtlRender(ui, { wrapper: AllTheProviders, ...options })
}

export { render, userEvent }
