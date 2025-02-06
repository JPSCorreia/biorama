import { ProfileInformation, ProfileHomeAddress, ProfileNotifications, ProfileOrders } from './Components';

// Mapeamento para renderizar componentes dinâmicos
const DadosPessoais = () => <ProfileInformation />;
const Moradas = () => <ProfileHomeAddress />;
const Notifications = () => <ProfileNotifications />;
const Orders = () => <ProfileOrders />;



export const componentsMap = {
    "Dados Pessoais": DadosPessoais,
    "Moradas": Moradas,
    "Notificações": Notifications,
    "Encomendas": Orders
};
