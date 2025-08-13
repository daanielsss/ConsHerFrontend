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
    <div className="flex h-screen overflow-x-hidden">
      {user && <Sidebar />}

      {/* CAMBIO 1: Este div ahora se encargará del scroll. Añadimos 'overflow-y-auto' */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 overflow-y-auto ${user ? (expanded ? "pl-56" : "pl-0") : ""
          }`}
      >
        <Header />

        {/* CAMBIO 2: <main> ahora es flexible. Quitamos 'h-full' y 'overflow-y-auto' y añadimos 'flex-1' */}
        <main className="flex-1">
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