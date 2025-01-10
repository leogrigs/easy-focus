import { render, screen } from "@testing-library/react";
import CircularProgressBar from "./CircularProgressBar";

describe("CircularProgressBar Component", () => {
  it("renders an SVG element", () => {
    render(<CircularProgressBar percent={50} size={100} />);
    const svgElement = screen.getByTestId("circular-progress");
    expect(svgElement).toBeInTheDocument();
  });

  it("calculates the circle's radius and circumference correctly", () => {
    const size = 100;
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;

    render(<CircularProgressBar percent={50} size={size} />);

    const circle = screen.getByTestId("circular-progress-circle");
    expect(circle).toHaveAttribute("r", radius.toString());
    expect(circle).toHaveAttribute(
      "stroke-dasharray",
      circumference.toString()
    );
  });

  it("calculates the strokeDashoffset based on the percent prop", () => {
    const size = 100;
    const percent = 50;
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    const expectedOffset = circumference - (percent / 100) * circumference;

    render(<CircularProgressBar percent={percent} size={size} />);

    const circle = screen.getByTestId("circular-progress-circle");
    expect(circle).toHaveAttribute(
      "stroke-dashoffset",
      expectedOffset.toString()
    );
  });

  it("renders children inside the SVG", () => {
    render(
      <CircularProgressBar percent={50} size={100}>
        <text>Test</text>
      </CircularProgressBar>
    );

    const textElement = screen.getByText("Test");
    expect(textElement).toBeInTheDocument();
  });
});
