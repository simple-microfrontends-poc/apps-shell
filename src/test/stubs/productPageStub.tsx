import React from "react";

// Stand-in for the `productPage/App` remote. Exposes the props the shell passes
// (sku, onBack) so routing/navigation can be asserted.
export default function ProductPageStub({
  sku,
  onBack,
}: {
  sku?: string;
  onBack?: () => void;
}) {
  // Escape hatch for exercising the shell's RemoteErrorBoundary.
  if (sku === "__throw__") throw new Error("stub boom");
  return (
    <div data-testid="remote-product-page">
      <span>product remote: {sku}</span>
      {onBack && (
        <button type="button" onClick={onBack}>
          stub-back
        </button>
      )}
    </div>
  );
}
