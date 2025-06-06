import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { getUserFromToken } from "@/lib/auth";

type Props = {
  showHero?: boolean;
};

function Layout({ showHero = false }: Props) {
  const { expanded } = useSidebar();
  const user = getUserFromToken(); // ← validamos si hay sesión activa

  return (
    <div className="flex min-h-screen">
      {/* Sidebar solo si hay sesión iniciada */}
      {user && <Sidebar />}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${user ? (expanded ? "pl-56" : "pl-16") : ""
          }`}
      >
        <Header />
        {showHero && <Hero />}

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 pt-[5.5rem] pb-10">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default Layout;
