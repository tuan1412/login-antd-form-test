import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, test, expect, beforeAll } from 'vitest'
import App from '../App'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

test('render login form', async () => {
  render(<App />)

  // render default ui login 
  expect(screen.queryByLabelText(/username/i)).toBeInTheDocument()
  expect(screen.queryByLabelText(/password/i)).toBeInTheDocument()
  expect(screen.queryByLabelText(/remember me/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/remember me/i)).toBeChecked()
  
  // validate when not fill form
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(screen.queryByText(/please input your username!/i)).toBeInTheDocument()
  expect(screen.queryByText(/please input your password!/i)).toBeInTheDocument()

  // validate when only fill user
  await userEvent.type(screen.queryByLabelText(/username/i), 'test')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(screen.queryByText(/please input your username!/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/please input your password!/i)).toBeInTheDocument()

  // validate when only fill password
  await userEvent.clear(screen.queryByLabelText(/username/i))
  await userEvent.type(screen.queryByLabelText(/password/i), 'test')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  expect(screen.queryByText(/please input your username!/i)).toBeInTheDocument()
  expect(screen.queryByText(/please input your password!/i)).not.toBeInTheDocument()
})