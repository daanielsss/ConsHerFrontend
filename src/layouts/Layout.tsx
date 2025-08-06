import { Outlet, useLocation } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { getUserFromToken } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

function Layout() {
  const { expanded } = useSidebar();
  const location = useLocation();

  // Nuevo: estado controlado del usuario para evitar parpadeos
  const [user, setUser] = useState<null | { name?: string; email: string }>(null);

  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
  }, []);

  // Mientras se determina el usuario, no renderizamos nada
  if (user === null) return null;

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Sidebar solo si hay sesión iniciada */}
      {user && expanded && <Sidebar />}

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
