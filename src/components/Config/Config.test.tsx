import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Config from "./Config";

describe("Config Component", () => {
  const mockSetConfig = vi.fn();
  const mockOnSelectSound = vi.fn();
  const mockOnApplyCustomUrl = vi.fn();

  const defaultProps = {
    initialPomodoroTime: 25,
    initialRestTime: 5,
    selectedSoundId: "original",
    customSoundUrl: "",
    setConfig: mockSetConfig,
    onSelectSound: mockOnSelectSound,
    onApplyCustomUrl: mockOnApplyCustomUrl,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders timer sliders and the footer actions", () => {
    render(<Config {...defaultProps} />);

    expect(screen.getByText("Focus:")).toBeInTheDocument();
    expect(screen.getByText("Rest:")).toBeInTheDocument();
    expect(screen.getByText("Volume:")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /restaurar padrões/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^mutar|desmutar$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^salvar$/i })).toBeInTheDocument();
  });

  it("allows changing focus and rest times", () => {
    render(<Config {...defaultProps} />);

    const focusSlider = screen.getByLabelText("Focus:") as HTMLInputElement;
    const restSlider = screen.getByLabelText("Rest:") as HTMLInputElement;

    fireEvent.change(focusSlider, { target: { value: 30 } });
    fireEvent.change(restSlider, { target: { value: 10 } });

    expect(focusSlider.value).toBe("30");
    expect(restSlider.value).toBe("10");
  });

  it("resets the configuration to default values", () => {
    render(<Config {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /restaurar padrões/i }));

    expect(mockSetConfig).toHaveBeenCalledWith(25, 5, true);
  });

  it("saves the current configuration when clicking the save button", () => {
    render(<Config {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /^salvar$/i }));

    expect(mockSetConfig).toHaveBeenCalledWith(25, 5, false);
  });
});
