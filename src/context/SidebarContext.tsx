import { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
    expanded: boolean;
    toggleSidebar: () => void;
    setExpanded: (value: boolean) => void; // ✅ agregado
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [expanded, setExpanded] = useState<boolean>(() => {
        const saved = localStorage.getItem("sidebarExpanded");
        return saved ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem("sidebarExpanded", JSON.stringify(expanded));
    }, [expanded]);

    const toggleSidebar = () => setExpanded(prev => !prev);

    return (
        <SidebarContext.Provider value={{ expanded, toggleSidebar, setExpanded }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error("useSidebar debe usarse dentro de <SidebarProvider>");
    return context;
};
