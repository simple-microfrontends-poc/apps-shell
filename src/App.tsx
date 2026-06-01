import React, { Suspense, useEffect, useState } from "react";
import { bus } from "@admin/event-bus";
import Sidebar from "./components/Sidebar";
import AppHeader from "./components/AppHeader";
import RemoteModule from "./components/RemoteModule";

type Page = "products" | "categories" | "product" | null;

function App() {
  const [activePage, setActivePage] = useState<Page>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  // Loosely coupled navigation: a product selected anywhere (e.g. the list)
  // opens the product card. The shell owns the routing decision.
  useEffect(() => {
    const handleProductSelected = ({ sku }: { sku: string }) => {
      setSelectedSku(sku);
      setActivePage("product");
    };
    bus.on("productSelected", handleProductSelected);
    return () => bus.off("productSelected", handleProductSelected);
  }, []);

  const handleNavChange = (page: string) => {
    setActivePage(page as Page);
    setSelectedSku(null);
    bus.emit("navChange", page);
  };

  const sidebarActive = activePage === "product" ? "products" : activePage;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={sidebarActive} onNavChange={handleNavChange} />
        <main className="flex-1 overflow-auto p-6">
          {activePage ? (
            <Suspense fallback={<div className="p-8 text-gray-500">Loading...</div>}>
              {activePage === "product" ? (
                <RemoteModule
                  page="product"
                  sku={selectedSku ?? undefined}
                  onBack={() => handleNavChange("products")}
                />
              ) : (
                <RemoteModule page={activePage} />
              )}
            </Suspense>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium">Panel administracyjny</p>
                <p className="text-sm mt-2">Wybierz pozycje z menu, aby zaczac.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
