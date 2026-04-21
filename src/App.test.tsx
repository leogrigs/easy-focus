import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders Easy Focus", () => {
    render(<App />);
    expect(screen.getByText(/Easy Focus/i)).toBeInTheDocument();
  });
});
