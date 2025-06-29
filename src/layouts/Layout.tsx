import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import { useSidebar } from "@/context/SidebarContext";
import { getUserFromToken } from "@/lib/auth";

function Layout() {
  const { expanded } = useSidebar();
  const user = getUserFromToken();

  return (
    <div className="flex min-h-screen">
      {user && <Sidebar />}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${user ? (expanded ? "pl-56 pr-4" : "pl-4 pr-4") : ""
          }`}
      >
        <Header />

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
