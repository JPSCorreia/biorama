import {ProfileInformation} from "../Profile/Components";
import { useSidebar } from "../Context/SidebarContext";
import { componentsMap } from "./utilis.jsx";
import { Box } from "@mui/material";

const DynamicContent = () => {
    const { activeItem } = useSidebar();

    // Obtém o componente correspondente ou uma mensagem padrão
    const ComponentToRender = componentsMap[activeItem] || (() => <ProfileInformation />);

    return (
            <ComponentToRender />
    );
};

export default DynamicContent;
