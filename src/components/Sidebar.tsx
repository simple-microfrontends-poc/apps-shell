import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { to: "/products", label: "Produkty", icon: "📦" },
  { to: "/categories", label: "Kategorie", icon: "📂" },
];

function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">Microfrontends Admin v1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
