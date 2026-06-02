import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar />
    </MemoryRouter>,
  );
}

describe("Sidebar", () => {
  it("renders the menu links with their targets", () => {
    renderAt("/");

    const produkty = screen.getByRole("link", { name: /Produkty/ });
    const kategorie = screen.getByRole("link", { name: /Kategorie/ });
    expect(produkty).toHaveAttribute("href", "/products");
    expect(kategorie).toHaveAttribute("href", "/categories");
  });

  it("marks the active link based on the current route", () => {
    renderAt("/categories");

    const kategorie = screen.getByRole("link", { name: /Kategorie/ });
    const produkty = screen.getByRole("link", { name: /Produkty/ });
    expect(kategorie).toHaveAttribute("aria-current", "page");
    expect(produkty).not.toHaveAttribute("aria-current");
    // NavLink applies the active class via the className callback.
    expect(kategorie.className).toContain("bg-indigo-50");
  });
});
