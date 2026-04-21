import { fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  it("dispatches the handler for the pressed key", () => {
    const onSpace = vi.fn();
    renderHook(() => useKeyboardShortcuts({ " ": onSpace }));
    fireEvent.keyDown(window, { key: " " });
    expect(onSpace).toHaveBeenCalledTimes(1);
  });

  it("is case-insensitive for letter keys", () => {
    const onR = vi.fn();
    renderHook(() => useKeyboardShortcuts({ r: onR }));
    fireEvent.keyDown(window, { key: "R" });
    expect(onR).toHaveBeenCalledTimes(1);
  });

  it("ignores key events when an input is focused", () => {
    const onR = vi.fn();
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    renderHook(() => useKeyboardShortcuts({ r: onR }));
    fireEvent.keyDown(input, { key: "r" });
    expect(onR).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it("does not attach listener when disabled", () => {
    const onN = vi.fn();
    renderHook(() => useKeyboardShortcuts({ n: onN }, false));
    fireEvent.keyDown(window, { key: "n" });
    expect(onN).not.toHaveBeenCalled();
  });
});
