import { render, screen } from "@testing-library/react"
import App from "./App"

test("renders learn react link", () => {
  render(<App />)
  // Adjust this test to match something that actually appears in your app
  const linkElement = screen.getByText(/Accesibilitate/i)
  expect(linkElement).toBeInTheDocument()
})
