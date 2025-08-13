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
    // CAMBIO 1: Añadimos 'h-screen' para que el layout ocupe toda la altura de la pantalla.
    <div className="flex h-screen overflow-x-hidden">
      {user && <Sidebar />}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${user ? (expanded ? "pl-56" : "pl-0") : ""
          }`}
      >
        <Header />

        {/* CAMBIO 2: Añadimos 'h-full' y 'overflow-y-auto' a la etiqueta <main> */}
        <main className="h-full overflow-y-auto">
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