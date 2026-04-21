import { fireEvent, render, screen } from "@testing-library/react";
import { Check } from "lucide-react";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Button component", () => {
  it("renders the button with the provided icon", () => {
    render(<Button icon={Check} onClick={() => {}} />);
    expect(screen.getByTestId("button-icon")).toBeInTheDocument();
  });

  it("applies the provided className to the icon", () => {
    render(<Button icon={Check} className="custom-class" onClick={() => {}} />);
    expect(screen.getByTestId("button-icon")).toHaveClass("custom-class");
  });

  it("calls the onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button icon={Check} onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
