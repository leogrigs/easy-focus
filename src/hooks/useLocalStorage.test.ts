import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() => useLocalStorage("foo", 42));
    expect(result.current[0]).toBe(42);
  });

  it("persists values under the prefixed key", () => {
    const { result } = renderHook(() => useLocalStorage("foo", 42));
    act(() => result.current[1](100));
    expect(result.current[0]).toBe(100);
    expect(window.localStorage.getItem("easy-focus:foo")).toBe("100");
  });

  it("reads previously stored values on mount", () => {
    window.localStorage.setItem("easy-focus:bar", JSON.stringify("hello"));
    const { result } = renderHook(() => useLocalStorage("bar", "world"));
    expect(result.current[0]).toBe("hello");
  });

  it("falls back to initial value when stored JSON is corrupt", () => {
    window.localStorage.setItem("easy-focus:bad", "not-json");
    const { result } = renderHook(() => useLocalStorage("bad", "safe"));
    expect(result.current[0]).toBe("safe");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));
    act(() => result.current[1]((prev) => prev + 1));
    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(2);
  });
});
