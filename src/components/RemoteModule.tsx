import React from "react";

type RemoteModuleProps = {
  page: "products" | "categories";
};

const remotes = {
  products: React.lazy(() => import("products/App")),
  categories: React.lazy(() => import("categories/App")),
} as const;

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

function RemoteModule({ page }: RemoteModuleProps) {
  const Component = remotes[page];
  return (
    <RemoteErrorBoundary key={page}>
      <Component />
    </RemoteErrorBoundary>
  );
}

export default RemoteModule;
