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

export default function Sidebar() {
    const user = getUserFromToken();
    const navigate = useNavigate();
    const location = useLocation();
    const { expanded, toggleSidebar } = useSidebar();

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

    if (!user) return null;

    return (
        <aside
            className={`h-screen fixed top-0 left-0 bg-primary text-primary-foreground flex flex-col transition-all duration-300 z-50
          ${expanded ? "w-56" : "w-16"}`}
        >
            <div className="flex flex-col h-full justify-between">
                {/* Header del sidebar */}
                <div>
                    <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                        {expanded && <h1 className="text-lg font-bold">ConsHer</h1>}
                        <button onClick={toggleSidebar}>
                            {expanded ? <PanelLeftClose /> : <PanelLeftOpen />}
                        </button>
                    </div>

                    {/* Perfil */}
                    <div className="flex flex-col items-center mt-6 mb-4 px-2">
                        <UserCircle size={40} className="text-accent-foreground" />
                        {expanded && user && (
                            <div className="mt-2 text-center">
                                <p className="text-sm font-semibold">{user.name || "Admin"}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Navegación */}
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-between px-4 py-3 transition text-sm font-medium rounded-md
                    ${location.pathname === item.path
                                        ? "bg-accent text-accent-foreground font-semibold"
                                        : "hover:bg-accent hover:text-accent-foreground"}
                    ${!expanded ? "justify-center" : ""}`}
                            >
                                {expanded ? (
                                    <>
                                        <span>{item.label}</span>
                                        <span>{item.icon}</span>
                                    </>
                                ) : (
                                    <span>{item.icon}</span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Logout */}
                <div className="px-4 py-4 border-t border-border mt-auto">
                    {expanded ? (
                        <button
                            onClick={handleLogout}
                            className="w-full text-destructive hover:text-destructive-foreground flex items-center justify-between"
                        >
                            <span>Cerrar sesión</span>
                            <LogOut size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="text-destructive hover:text-destructive-foreground"
                        >
                            <LogOut />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
