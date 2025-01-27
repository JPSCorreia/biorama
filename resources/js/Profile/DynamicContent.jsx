import {ProfileInformation} from "../Profile/Components";
import { useSidebar } from "../Context/SidebarContext";
import { componentsMap } from "./utilis.jsx";

const DynamicContent = () => {
    const { activeItem } = useSidebar();

    // Obtém o componente correspondente ou uma mensagem padrão
    const ComponentToRender = componentsMap[activeItem] || (() => <ProfileInformation />);

    return (
        <div>
            <ComponentToRender />
        </div>
    );
};

export default DynamicContent;
