import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Timer from "./Timer";

describe("Timer Component", () => {
  it("renders the timer with the correct format", () => {
    render(<Timer time={125} size={100} />);
    expect(screen.getByText("02:05")).toBeInTheDocument();
  });

  it("formats time correctly with leading zeros", () => {
    render(<Timer time={65} size={100} />);
    expect(screen.getByText("01:05")).toBeInTheDocument();
  });

  it("calculates the x and y attributes based on the size prop", () => {
    const size = 200;
    render(<Timer time={0} size={size} />);
    const timerElement = screen.getByText("00:00");
    expect(timerElement).toHaveAttribute("x", (size / 2).toString());
    expect(timerElement).toHaveAttribute("y", (-size / 2).toString());
  });

  it("handles zero time correctly", () => {
    render(<Timer time={0} size={100} />);
    expect(screen.getByText("00:00")).toBeInTheDocument();
  });
});
