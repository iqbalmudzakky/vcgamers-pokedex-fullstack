import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebounceValues } from "./use-debounced-value";

describe("useDebounceValues", () => {
  it("updates value after delay", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounceValues(value, 400),
      { initialProps: { value: "bulba" } },
    );

    expect(result.current).toBe("bulba");

    rerender({ value: "pikachu" });
    expect(result.current).toBe("bulba");

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("pikachu");
    vi.useRealTimers();
  });
});
