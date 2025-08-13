// src/components/Sidebar.tsx

import {
    Home,
    LayoutDashboard,
    Ruler,
    BarChart2,
    LogOut,
    UserCircle,
    Building,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUserFromToken } from "@/lib/auth";
import { useSidebar } from "@/context/SidebarContext";
import { useEffect } from "react";

interface User {
    email: string;
    name?: string;
}

export default function Sidebar() {
    const user = getUserFromToken() as User | null;
    const navigate = useNavigate();
    const location = useLocation();
    const { expanded, toggleSidebar, setExpanded } = useSidebar();

    const navItems = [
        { label: "Inicio", icon: <Home />, path: "/" },
        { label: "Panel", icon: <LayoutDashboard />, path: "/admin/houses" },
        { label: "Propiedades", icon: <Building />, path: "/admin" },
        { label: "Calculadora", icon: <Ruler />, path: "/admin/calculadora" },
        { label: "Gastos", icon: <BarChart2 />, path: "/admin/gastos" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setExpanded(false);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Ejecutar al montar
        return () => window.removeEventListener("resize", handleResize);
    }, [setExpanded]);

    if (!user) return null;

    return (
        <>
            {/* Botón flotante para ABRIR (z-index alto para estar sobre todo) */}
            <button
                className={`fixed top-4 left-4 z-50 bg-primary text-white rounded-full p-2 shadow-lg transition-opacity duration-300 ${!expanded ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleSidebar}
            >
                <PanelLeftOpen />
            </button>

            {/* Overlay oscuro (debe estar debajo del sidebar pero encima del contenido) */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 md:hidden ${expanded ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setExpanded(false)}
            />

            {/* Sidebar (la capa más alta cuando está visible) */}
            <aside
                className={`fixed top-0 left-0 h-full w-56 bg-primary text-primary-foreground flex flex-col z-50
            transition-transform duration-300 ease-in-out
            ${expanded ? "translate-x-0" : "-translate-x-full"}
          `}
            >
                <div className="flex flex-col flex-1">
                    {/* Header del Sidebar */}
                    <div className="flex items-center justify-between p-4 border-b border-primary-foreground/20">
                        <h1 className="text-lg font-bold">ConsHer</h1>
                        <button onClick={toggleSidebar}>
                            <PanelLeftClose />
                        </button>
                    </div>

                    {/* Perfil del Usuario */}
                    <div className="p-4 flex flex-col items-center text-center">
                        <UserCircle size={40} className="mb-2" />
                        <p className="text-sm font-semibold">{user.name ?? "Admin"}</p>
                        <p className="text-xs opacity-70">{user.email}</p>
                    </div>

                    {/* Navegación Principal */}
                    <nav className="flex-1 px-2 py-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => { if (window.innerWidth < 768) setExpanded(false); }}
                                className={`flex items-center gap-3 px-3 py-2.5 transition text-sm font-medium rounded-md ${location.pathname === item.path
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-accent/20"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Logout en la parte inferior */}
                    <div className="p-2 border-t border-primary-foreground/20">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-destructive-foreground hover:bg-destructive/80 rounded-md"
                        >
                            <LogOut size={18} />
                            <span>Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}