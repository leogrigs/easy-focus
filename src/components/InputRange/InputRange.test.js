import { fireEvent, render, screen } from "@testing-library/react";
import InputRange from "./InputRange";

// Mock the handleValueChange function
const mockHandleValueChange = jest.fn();

// Mock the valueLabelFunction to format the value
const mockValueLabelFunction = (value) => `${value}%`;

describe("InputRange Component", () => {
  const defaultProps = {
    label: "Volume",
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    valueLabelFunction: mockValueLabelFunction,
    handleValueChange: mockHandleValueChange,
  };

  it("renders the label and slider", () => {
    render(<InputRange {...defaultProps} />);

    expect(screen.getByText("Volume")).toBeInTheDocument();

    const slider = screen.getByRole("slider");
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

  it("does not call handleValueChange when the value does not change", () => {
    render(<InputRange {...defaultProps} />);

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: 50 } });

    expect(mockHandleValueChange).not.toHaveBeenCalled();
  });
});
