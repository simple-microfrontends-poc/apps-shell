import React from "react";

type Page = "products" | "categories" | "product";

type RemoteModuleProps = {
  page: Page;
  id?: number;
  onBack?: () => void;
};

const remotes: Record<Page, React.LazyExoticComponent<React.ComponentType<any>>> = {
  products: React.lazy(() => import("products/App")),
  categories: React.lazy(() => import("categories/App")),
  product: React.lazy(() => import("productPage/App")),
};

class RemoteErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-700 font-medium">Blad ładowania</h2>
          <p className="text-red-600 text-sm mt-1">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function RemoteModule({ page, id, onBack }: RemoteModuleProps) {
  const Component = remotes[page];
  const props = page === "product" ? { id, onBack } : {};
  return (
    <RemoteErrorBoundary key={page}>
      <Component {...props} />
    </RemoteErrorBoundary>
  );
}

export default RemoteModule;
