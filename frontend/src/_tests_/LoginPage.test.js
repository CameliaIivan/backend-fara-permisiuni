import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'

// Mock AuthContext to avoid network requests and provide minimal functions
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}))

describe('LoginPage', () => {
  test('renders email and password inputs and submit button', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Parolă/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Autentificare/i })).toBeInTheDocument()
  })
})