import { describe, it, expect, vi } from "vitest";
import { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RemoteModule from "./RemoteModule";

function renderRemote(ui: React.ReactNode) {
  // The remotes are React.lazy, so they need a Suspense boundary above them.
  return render(<Suspense fallback={<div>loading</div>}>{ui}</Suspense>);
}

describe("RemoteModule", () => {
  it("renders the products remote for page=products", async () => {
    renderRemote(<RemoteModule page="products" />);
    expect(await screen.findByTestId("remote-products")).toBeInTheDocument();
  });

  it("renders the categories remote for page=categories", async () => {
    renderRemote(<RemoteModule page="categories" />);
    expect(await screen.findByTestId("remote-categories")).toBeInTheDocument();
  });

  it("passes sku and onBack to the product remote", async () => {
    const onBack = vi.fn();
    const user = userEvent.setup();
    renderRemote(<RemoteModule page="product" sku="A1" onBack={onBack} />);

    expect(await screen.findByText("product remote: A1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "stub-back" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("catches a failing remote with the error boundary", async () => {
    // Boundary logs the caught error — silence the expected noise.
    vi.spyOn(console, "error").mockImplementation(() => {});
    renderRemote(<RemoteModule page="product" sku="__throw__" />);

    expect(await screen.findByText("Blad ładowania")).toBeInTheDocument();
    expect(screen.getByText("stub boom")).toBeInTheDocument();
  });
});
