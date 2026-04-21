import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SoundPicker, { CUSTOM_SOUND_ID } from "./SoundPicker";

const noop = () => undefined;

describe("SoundPicker", () => {
  it("renders the catalogue sounds", () => {
    render(
      <SoundPicker
        selectedSoundId="original"
        customUrl=""
        onSelectSound={noop}
        onApplyCustomUrl={noop}
      />
    );
    expect(screen.getByText("Original")).toBeInTheDocument();
    expect(screen.getByText("Silêncio")).toBeInTheDocument();
  });

  it("marks the selected sound with aria-checked", () => {
    render(
      <SoundPicker
        selectedSoundId="silence"
        customUrl=""
        onSelectSound={noop}
        onApplyCustomUrl={noop}
      />
    );
    const silence = screen.getByRole("radio", { name: /silêncio/i });
    expect(silence).toHaveAttribute("aria-checked", "true");
    const original = screen.getByRole("radio", { name: /original/i });
    expect(original).toHaveAttribute("aria-checked", "false");
  });

  it("calls onSelectSound when a card is clicked", () => {
    const onSelect = vi.fn();
    render(
      <SoundPicker
        selectedSoundId="original"
        customUrl=""
        onSelectSound={onSelect}
        onApplyCustomUrl={noop}
      />
    );
    fireEvent.click(screen.getByRole("radio", { name: /silêncio/i }));
    expect(onSelect).toHaveBeenCalledWith("silence");
  });

  it("only enables Usar when URL looks valid and calls onApplyCustomUrl", () => {
    const onApply = vi.fn();
    render(
      <SoundPicker
        selectedSoundId="original"
        customUrl=""
        onSelectSound={noop}
        onApplyCustomUrl={onApply}
      />
    );
    const apply = screen.getByRole("button", { name: /usar link/i });
    expect(apply).toBeDisabled();

    const input = screen.getByLabelText(/use um link/i);
    fireEvent.change(input, {
      target: { value: "https://youtu.be/abc123" },
    });
    expect(apply).not.toBeDisabled();

    fireEvent.click(apply);
    expect(onApply).toHaveBeenCalledWith("https://youtu.be/abc123");
  });

  it("shows the active custom URL host when custom sound is selected", () => {
    render(
      <SoundPicker
        selectedSoundId={CUSTOM_SOUND_ID}
        customUrl="https://example.com/stream.mp3"
        onSelectSound={noop}
        onApplyCustomUrl={noop}
      />
    );
    expect(screen.getByText(/example\.com/i)).toBeInTheDocument();
  });
});
