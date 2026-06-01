import React, { Suspense, useState } from "react";
import { bus } from "@admin/event-bus";
import Sidebar from "./components/Sidebar";
import AppHeader from "./components/AppHeader";
import RemoteModule from "./components/RemoteModule";

type Page = "products" | "categories" | null;

function App() {
  const [activePage, setActivePage] = useState<Page>(null);

  const handleNavChange = (page: string) => {
    setActivePage(page as Page);
    bus.emit("navChange", page);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onNavChange={handleNavChange} />
        <main className="flex-1 overflow-auto p-6">
          {activePage ? (
            <Suspense fallback={<div className="p-8 text-gray-500">Loading...</div>}>
              <RemoteModule page={activePage} />
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
