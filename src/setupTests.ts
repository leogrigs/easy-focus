import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// jsdom doesn't implement HTMLMediaElement methods. Stub them to silence
// noisy warnings from AudioPlayer during component tests.
Object.defineProperty(HTMLMediaElement.prototype, "play", {
  configurable: true,
  value: vi.fn().mockResolvedValue(undefined),
});
Object.defineProperty(HTMLMediaElement.prototype, "pause", {
  configurable: true,
  value: vi.fn(),
});
Object.defineProperty(HTMLMediaElement.prototype, "load", {
  configurable: true,
  value: vi.fn(),
});
