import { Box, Typography } from '@mui/material';

const IntroStep2VendorRegister = () => {
    return (
        <Box sx={{ mt: 4, px: 2 }}>
            <Box
                sx={{
                    width: "90%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    m: "auto",
                }}
            >

                <Box
                    sx={{
                        textAlign: "justify",
                        width: "50%",
                        display: "flex",
                        flexDirection: "column",
                        mt: "5%",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Passo 2
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                        }}
                        gutterBottom
                    >
                        Registe a sua loja
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                        Agora que já nos forneceu os seus dados para personalizarmos o seu perfil como vendedor,
                        é o momento de criar a identidade do seu negócio. Esta etapa é essencial para apresentar a sua
                        loja de forma clara e atrativa, permitindo que os seus clientes conheçam melhor os seus produtos e serviços.
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, fontSize: "1.2rem" }}>
                        Nesta fase, irá registar a sua loja ou empresa, preenchendo informações essenciais como o nome,
                        contactos e morada. Poderá também adicionar imagens representativas que ajudarão a criar uma
                        identidade visual apelativa e profissional.
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, fontSize: "1.2rem" }}>
                        Utilize o mapa interativo para indicar a localização exata do seu espaço. Isto ajudará os seus clientes
                        a encontrá-lo com facilidade, permitindo que chegue mais rapidamente até eles.
                    </Typography>
                </Box>
                <Box
                    component="img"
                    src='/images/Fase 2 - registoVendor.png'
                    alt="Imagem ilustrativa do registo da loja"
                    sx={{
                        width: "40%",
                        objectFit: "cover",
                        borderRadius: "8px",
                        minHeight: "400px",
                        display: "flex",
                        alignItems: "flex-end",
                        mt: "10%",
                    }}
                />
            </Box>
        </Box>
    );
}
export default IntroStep2VendorRegister;
