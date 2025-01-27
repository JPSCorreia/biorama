import { ProfileInformation, ProfileHomeAddress } from './Components';

// Mapeamento para renderizar componentes dinâmicos
const DadosPessoais = () => <ProfileInformation />;
const Moradas = () => <ProfileHomeAddress />;

export const componentsMap = {
    "Dados Pessoais": DadosPessoais,
    "Moradas": Moradas,
};
