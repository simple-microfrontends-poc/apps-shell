import React, { Suspense, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { bus } from "@admin/event-bus";
import Sidebar from "./components/Sidebar";
import AppHeader from "./components/AppHeader";
import RemoteModule from "./components/RemoteModule";

function Home() {
  return (
    <div className="flex items-center justify-center h-full text-gray-400">
      <div className="text-center">
        <p className="text-lg font-medium">Panel administracyjny</p>
        <p className="text-sm mt-2">Wybierz pozycje z menu, aby zaczac.</p>
      </div>
    </div>
  );
}

function ProductPageRoute() {
  const { sku } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Set when we arrived from the list (see Layout) — carries the list URL with
  // its filters. Going back one history entry restores that exact list state.
  const cameFromList = Boolean((location.state as { from?: string } | null)?.from);
  const handleBack = () => (cameFromList ? navigate(-1) : navigate("/products"));
  return <RemoteModule page="product" sku={sku} onBack={handleBack} />;
}

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  // Latest location, readable inside the (once-subscribed) event handler.
  const locationRef = useRef(location);
  locationRef.current = location;

  // Loosely coupled navigation: a product selected anywhere (e.g. the list)
  // is translated by the shell into a URL — the shell owns routing. We stash the
  // current list URL (with its filters) so "back to list" can restore it.
  useEffect(() => {
    const handleProductSelected = ({ sku }: { sku: string }) => {
      const from = locationRef.current.pathname + locationRef.current.search;
      navigate(`/products/${encodeURIComponent(sku)}`, { state: { from } });
    };
    bus.on("productSelected", handleProductSelected);
    return () => bus.off("productSelected", handleProductSelected);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Suspense fallback={<div className="p-8 text-gray-500">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<RemoteModule page="products" />} />
              <Route path="/products/:sku" element={<ProductPageRoute />} />
              <Route path="/categories" element={<RemoteModule page="categories" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
