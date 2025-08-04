import { Outlet, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { getUserFromToken } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

function Layout() {
  const { expanded } = useSidebar();
  const user = getUserFromToken();
  const location = useLocation(); // ← Detectamos ruta actual

  return (
    <div className="flex min-h-screen">
      {/* Sidebar solo si hay sesión iniciada */}
      {user && <Sidebar />}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${user ? (expanded ? "pl-56" : "pl-0") : ""
          }`}
      >
        <Header />

        <main className="flex-1">
          {/* HomePage sin márgenes */}
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
