import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ErrorState } from "./error-state";

describe("ErrorState", () => {
  it("renders message and triggers retry", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    render(
      <ErrorState
        title="Failed to Load"
        message="Network error"
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("Failed to Load")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
