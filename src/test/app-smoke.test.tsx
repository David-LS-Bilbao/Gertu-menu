import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "@/App";

describe("App", () => {
  it("renders the landing page", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: /menús familiares sostenibles/i,
      }),
    ).toBeInTheDocument();
  });
});
