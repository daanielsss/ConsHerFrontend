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
    // Contenedor general, ya NO es flex. Solo establece el fondo.
    <div className="bg-gray-100 dark:bg-gray-900">

      {/* El Sidebar se renderiza aquí. Asumimos que tiene position: fixed en su propio CSS */}
      {user && <Sidebar />}

      {/* Este es AHORA el contenedor principal y el que se encargará del SCROLL */}
      <div
        className={`transition-all duration-300 h-screen overflow-y-auto ${user && expanded ? "ml-56" : "ml-0" // Usamos margin-left para hacer espacio
          }`}
      >
        {/* El Header ahora vive DENTRO del contenedor que hace scroll */}
        <Header />

        {/* El <main> ya no necesita clases de layout, solo se encarga del contenido */}
        <main>
          {location.pathname === "/" ? (
            <Outlet />
          ) : (
            // Este div interior es para centrar y dar padding al contenido en páginas que no son el Home
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