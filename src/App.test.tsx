import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("renders Easy Focus title", () => {
    render(<App />);
    expect(screen.getByText(/Easy Focus/i)).toBeInTheDocument();
  });

  it("renders default focus duration timer (25:00)", () => {
    render(<App />);
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("shows Focus mode by default", () => {
    render(<App />);
    expect(screen.getByText("Focus")).toBeInTheDocument();
  });
});
