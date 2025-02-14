import {Box, Typography, useMediaQuery, useTheme} from '@mui/material';

const IntroStep2VendorRegister = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const smallerThanXl = useMediaQuery(theme.breakpoints.down("xl"));

    return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    // "& > :first-of-type": {
                    //     mb: 4,
                    // },
                    minHeight: "67.6vh",
                }}
            >

                <Box
                    sx={{
                        textAlign: "justify",
                        display: "flex",
                        justifyContent: "flex-start",
                        pl: smallerThanXl ? 0 : 8,
                        mb: smallerThanXl ? 2 : 0,
                        pt: smallerThanXl? 0 : 6,
                        flexGrow: 1,
                        minHeight: "600px",
                        maxWidth: smallerThanXl ? "100%" : "50%",
                        flexDirection: "column",
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
                    src="/images/Fase 2 - registoVendor.png"
                    alt="Imagem ilustrativa de registo"
                    sx={{
                        mt: 2,
                        maxWidth: "700px",
                        display: smallerThanXl ? "none" : "block",
                    }}
                />
            </Box>
    );
}
export default IntroStep2VendorRegister;
