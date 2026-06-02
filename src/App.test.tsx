import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { bus } from "@admin/event-bus";

// App uses BrowserRouter, so drive routing through jsdom's history.
function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

beforeEach(() => {
  window.history.pushState({}, "", "/");
});

describe("shell App — routing", () => {
  it("shows the home screen at /", () => {
    renderAt("/");
    expect(screen.getByText("Panel administracyjny")).toBeInTheDocument();
  });

  it("renders the products remote at /products", async () => {
    renderAt("/products");
    expect(await screen.findByTestId("remote-products")).toBeInTheDocument();
  });

  it("renders the categories remote at /categories", async () => {
    renderAt("/categories");
    expect(await screen.findByTestId("remote-categories")).toBeInTheDocument();
  });

  it("renders the product remote with the id from the URL", async () => {
    renderAt("/products/9");
    expect(await screen.findByText("product remote: 9")).toBeInTheDocument();
  });

  it("redirects unknown routes back to home", () => {
    renderAt("/nonsense");
    expect(screen.getByText("Panel administracyjny")).toBeInTheDocument();
  });

  it("navigates via the sidebar", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(screen.getByRole("link", { name: /Produkty/ }));
    expect(await screen.findByTestId("remote-products")).toBeInTheDocument();
  });
});

describe("shell App — event-bus navigation", () => {
  it("navigates to the product page when productSelected is emitted", async () => {
    renderAt("/products");
    await screen.findByTestId("remote-products");

    await act(async () => {
      bus.emit("productSelected", { id: 1 });
    });

    expect(await screen.findByText("product remote: 1")).toBeInTheDocument();
  });

  it("goes back to the list (history) after arriving from the list", async () => {
    const user = userEvent.setup();
    renderAt("/products");
    await screen.findByTestId("remote-products");

    await act(async () => {
      bus.emit("productSelected", { id: 1 });
    });
    await screen.findByText("product remote: 1");

    // Arrived from the list -> back uses history and restores it.
    await user.click(screen.getByRole("button", { name: "stub-back" }));
    expect(await screen.findByTestId("remote-products")).toBeInTheDocument();
  });

  it("falls back to /products on back when deep-linked directly", async () => {
    const user = userEvent.setup();
    renderAt("/products/7");
    await screen.findByText("product remote: 7");

    await user.click(screen.getByRole("button", { name: "stub-back" }));
    expect(await screen.findByTestId("remote-products")).toBeInTheDocument();
  });
});
