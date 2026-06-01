import React from "react";

function AppHeader() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Ecommerce Platform</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-sm font-medium text-indigo-700">A</span>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
