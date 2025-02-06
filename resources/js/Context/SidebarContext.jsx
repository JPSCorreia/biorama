import { createContext, useContext, useState } from "react";

// Criação do contexto
const SidebarContext = createContext();

// Provider para envolver a aplicação
export const SidebarProvider = ({ children }) => {
    const [activeItem, setActiveItem] = useState("Dados Pessoais"); // Estado do item ativo na sidebar

    return (
        <SidebarContext.Provider value={{ activeItem, setActiveItem }}>
            {children}
        </SidebarContext.Provider>
    );
};

// Hook para acessar o contexto
export const useSidebar = () => {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error("useSidebar deve ser usado dentro de um SidebarProvider");
    }

    return context;
};
