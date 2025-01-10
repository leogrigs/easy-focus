import { fireEvent, render, screen } from "@testing-library/react";
import { Check } from "lucide-react";
import Button from "./Button";

describe("Button component", () => {
  it("renders the button with the provided icon", () => {
    render(<Button icon={Check} onClick={() => {}} />);
    const iconElement = screen.getByTestId("button-icon");
    expect(iconElement).toBeInTheDocument();
  });

  it("applies the provided className to the icon", () => {
    const customClassName = "custom-class";
    render(
      <Button icon={Check} className={customClassName} onClick={() => {}} />
    );
    const iconElement = screen.getByTestId("button-icon");
    expect(iconElement).toHaveClass(customClassName);
  });

  it("calls the onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button icon={Check} onClick={handleClick} />);
    const buttonElement = screen.getByRole("button");
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
