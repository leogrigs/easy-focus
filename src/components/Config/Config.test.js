/* eslint-disable testing-library/no-node-access */
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Config from "./Config";

describe("Config Component", () => {
  const mockSetConfig = jest.fn();

  const defaultProps = {
    initialPomodoroTime: 25,
    initialRestTime: 5,
    setConfig: mockSetConfig,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders input ranges and buttons", () => {
    render(<Config {...defaultProps} />);

    expect(screen.getByText("Focus:")).toBeInTheDocument();
    expect(screen.getByText("Rest:")).toBeInTheDocument();
    expect(screen.getByText("Volume:")).toBeInTheDocument();

    expect(screen.getAllByRole("button").length).toBe(3); // 3 buttons (Reset, Mute/Unmute, Save)
  });

  it("allows changing focus and rest times", () => {
    render(<Config {...defaultProps} />);

    const focusSlider = screen.getByLabelText("Focus:");
    const restSlider = screen.getByLabelText("Rest:");

    fireEvent.change(focusSlider, { target: { value: 30 } });
    fireEvent.change(restSlider, { target: { value: 10 } });

    expect(focusSlider.value).toBe("30");
    expect(restSlider.value).toBe("10");
  });

  it("toggles mute/unmute when the mute button is clicked", () => {
    render(<Config {...defaultProps} />);

    const muteButton = screen.getAllByRole("button")[1];

    expect(muteButton.querySelector("svg")).toBeTruthy();

    fireEvent.click(muteButton);

    expect(muteButton.querySelector("svg")).toBeTruthy();
  });

  it("resets the configuration to default values", () => {
    render(<Config {...defaultProps} />);

    const resetButton = screen.getAllByRole("button")[0];

    fireEvent.click(resetButton);

    expect(mockSetConfig).toHaveBeenCalledWith(25, 5, true);
  });

  it("saves the current configuration when clicking the save button", () => {
    render(<Config {...defaultProps} />);

    const saveButton = screen.getAllByRole("button")[2];

    fireEvent.click(saveButton);

    expect(mockSetConfig).toHaveBeenCalledWith(25, 5, false);
  });
});
