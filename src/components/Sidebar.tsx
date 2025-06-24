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
        { label: "Propiedades", icon: <Building />, path: "/admin/houses" },
        { label: "Panel", icon: <LayoutDashboard />, path: "/admin" },
        { label: "Calculadora", icon: <Ruler />, path: "/admin/calculadora" },
        { label: "Gastos", icon: <BarChart2 />, path: "/admin/gastos" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setExpanded(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setExpanded]);

    if (!user) return null;

    return (
        <>
            {/* FAB: Botón flotante visible solo en móvil */}
            {!expanded && (
                <button
                    className="md:hidden fixed top-4 left-4 z-50 bg-primary text-white rounded-full p-2 shadow-lg"
                    onClick={toggleSidebar}
                >
                    <PanelLeftOpen />
                </button>
            )}

            {/* Sidebar con slide-in/out */}
            <aside
                className={`
                    fixed top-0 left-0 h-screen z-40 bg-primary text-primary-foreground flex flex-col transition-transform duration-300
                    transform ${expanded ? "translate-x-0" : "-translate-x-full"} w-56
                    md:translate-x-0 md:w-56
                `}
            >
                <div className="flex flex-col h-full justify-between">
                    {/* Header */}
                    <div>
                        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                            <h1 className="text-lg font-bold">ConsHer</h1>
                            <button onClick={toggleSidebar}>
                                <PanelLeftClose />
                            </button>
                        </div>

                        {/* Perfil */}
                        <div className="flex flex-col items-center mt-6 mb-4 px-2">
                            <UserCircle size={40} className="text-accent-foreground" />
                            <div className="mt-2 text-center">
                                <p className="text-sm font-semibold">{user.name ?? "Admin"}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        {/* Navegación */}
                        <div className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => {
                                        if (window.innerWidth < 768) setExpanded(false);
                                    }}
                                    className={`flex items-center justify-between px-4 py-3 transition text-sm font-medium rounded-md
                                        ${location.pathname === item.path
                                            ? "bg-accent text-accent-foreground font-semibold"
                                            : "hover:bg-accent hover:text-accent-foreground"}
                                    `}
                                >
                                    <span>{item.label}</span>
                                    <span>{item.icon}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Logout */}
                    <div className="px-4 py-4 border-t border-border mt-auto">
                        <button
                            onClick={handleLogout}
                            className="w-full text-destructive hover:text-destructive-foreground flex items-center justify-between"
                        >
                            <span>Cerrar sesión</span>
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
