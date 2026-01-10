import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App.tsx";

describe("App", () => {
  it("renders heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "React + Vite + TypeScript",
    );
  });

  it("increments count on button click", async () => {
    const user = userEvent.setup();
    render(<App />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Count: 0");

    await user.click(button);
    expect(button).toHaveTextContent("Count: 1");

    await user.click(button);
    expect(button).toHaveTextContent("Count: 2");
  });
});
