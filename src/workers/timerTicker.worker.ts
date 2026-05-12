/// <reference lib="webworker" />

// Background tabs throttle `setInterval` on the main thread (down to ~1/min
// after a few minutes, with possible page freezing). A dedicated Worker keeps
// firing at the requested cadence so the main thread can recompute the timer
// against wall-clock time and update the tab title even when hidden.

type IncomingMessage =
  | { type: "start"; interval?: number }
  | { type: "stop" };

let intervalId: ReturnType<typeof setInterval> | null = null;

const stop = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

self.onmessage = (event: MessageEvent<IncomingMessage>) => {
  const data = event.data;
  if (data.type === "start") {
    stop();
    const interval = Math.max(50, data.interval ?? 250);
    intervalId = setInterval(() => {
      (self as DedicatedWorkerGlobalScope).postMessage(Date.now());
    }, interval);
  } else if (data.type === "stop") {
    stop();
  }
};

export {};
