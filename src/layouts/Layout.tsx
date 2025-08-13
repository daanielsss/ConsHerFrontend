// src/layouts/Layout.tsx

import { Outlet, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { getUserFromToken } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

function Layout() {
  const { expanded } = useSidebar();
  const location = useLocation();
  const user = getUserFromToken();

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      {user && <Sidebar />}

      {/* 👇 CAMBIO PRINCIPAL: Se elimina la transición de este div 👇 */}
      <div
        className={`h-screen overflow-y-auto ${user && expanded ? "ml-56" : "ml-0" // El margen cambia, pero SIN transición.
          }`}
      >
        {/* Header y Main no necesitan cambios */}
        <Header />
        <main>
          {location.pathname === "/" ? (
            <Outlet />
          ) : (
            <div className="max-w-7xl mx-auto px-4 pt-6 pb-10">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Layout;