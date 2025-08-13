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
    // El contenedor principal ahora solo sirve para establecer el color de fondo.
    <div className="bg-gray-100 dark:bg-gray-900">

      {/* El Sidebar sigue aquí. Se asume que usa 'position: fixed' internamente. */}
      {user && <Sidebar />}

      {/* ▼▼▼ CAMBIO DE ESTRATEGIA FUNDAMENTAL ▼▼▼
        Este 'div' ahora se posiciona de forma absoluta para ocupar todo el espacio 
        disponible a la derecha del sidebar. Esta es una forma más explícita
        de definir el área de scroll.
      */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-y-auto transition-all duration-300 ${user && expanded ? "left-56" : "left-0"
          }`}
      >
        {/* El Header y el Main viven dentro de este contenedor de scroll explícito */}
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