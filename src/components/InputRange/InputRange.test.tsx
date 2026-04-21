import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InputRange from "./InputRange";

const mockValueLabelFunction = (value: number) => `${value}%`;

describe("InputRange Component", () => {
  let mockHandleValueChange = vi.fn();

  const defaultProps = {
    label: "Volume",
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    valueLabelFunction: mockValueLabelFunction,
    handleValueChange: mockHandleValueChange,
  };

  beforeEach(() => {
    mockHandleValueChange = vi.fn();
    defaultProps.handleValueChange = mockHandleValueChange;
  });

  it("renders the label and slider", () => {
    render(<InputRange {...defaultProps} />);
    expect(screen.getByText("Volume")).toBeInTheDocument();
    const slider = screen.getByRole("slider") as HTMLInputElement;
    expect(slider).toHaveValue("50");
  });

  it("calls handleValueChange when the slider value changes", () => {
    render(<InputRange {...defaultProps} />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: 75 } });
    expect(mockHandleValueChange).toHaveBeenCalledWith(75);
  });

  it("displays the value using valueLabelFunction", () => {
    render(<InputRange {...defaultProps} />);
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("associates label with input via htmlFor", () => {
    render(<InputRange {...defaultProps} />);
    const slider = screen.getByLabelText("Volume");
    expect(slider).toBeInTheDocument();
  });
});
