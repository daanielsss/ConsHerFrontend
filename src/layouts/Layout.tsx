// src/layouts/Layout.tsx

import { Outlet, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { getUserFromToken } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// No necesitamos useState ni useEffect aquí

function Layout() {
  const { expanded } = useSidebar();
  const location = useLocation();

  // Obtenemos el usuario directamente en cada renderizado. Es instantáneo.
  const user = getUserFromToken();

  // Ya no hay un `if (user === null) return null;`
  // El layout se renderizará siempre, con o sin usuario.

  return (
    <div className="flex overflow-x-hidden">
      {/* El Sidebar se mostrará condicionalmente si existe un usuario */}
      {user && <Sidebar />}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${user ? (expanded ? "pl-56" : "pl-0") : ""
          }`}
      >
        <Header />
        <main> {/* Aquí, quita la clase flex-1 */}
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