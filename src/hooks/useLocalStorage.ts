import { useCallback, useEffect, useState } from "react";

const PREFIX = "easy-focus:";

function read<T>(key: string, initial: T): T {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return initial;
    return JSON.parse(raw) as T;
  } catch {
    return initial;
  }
}

function write<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* quota or privacy mode — ignore silently */
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => read(key, initialValue));

  useEffect(() => {
    write(key, value);
  }, [key, value]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) =>
        typeof next === "function" ? (next as (p: T) => T)(prev) : next
      );
    },
    []
  );

  return [value, set];
}
