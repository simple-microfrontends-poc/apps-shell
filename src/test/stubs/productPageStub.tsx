import React from "react";

// Stand-in for the `productPage/App` remote. Exposes the props the shell passes
// (id, onBack) so routing/navigation can be asserted.
export default function ProductPageStub({
  id,
  onBack,
}: {
  id?: number;
  onBack?: () => void;
}) {
  // Escape hatch for exercising the shell's RemoteErrorBoundary.
  if (id === -1) throw new Error("stub boom");
  return (
    <div data-testid="remote-product-page">
      <span>product remote: {id}</span>
      {onBack && (
        <button type="button" onClick={onBack}>
          stub-back
        </button>
      )}
    </div>
  );
}
