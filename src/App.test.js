import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Easy Focus", () => {
  render(<App />);
  const linkElement = screen.getByText(/Easy Focus/i);
  expect(linkElement).toBeInTheDocument();
});
