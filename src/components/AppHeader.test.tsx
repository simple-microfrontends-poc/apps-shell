import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AppHeader from "./AppHeader";

describe("AppHeader", () => {
  it("renders the platform label and the user avatar", () => {
    render(<AppHeader />);

    expect(screen.getByText("Ecommerce Platform")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
