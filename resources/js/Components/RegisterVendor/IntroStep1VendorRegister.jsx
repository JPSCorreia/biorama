import {Box, Typography, useMediaQuery, useTheme} from '@mui/material';

const IntroStep1VendorRegister = () => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));



    return (
        <Box sx={{ mt: 4, px: 2 }}>
            <Box
                sx={{
                    width: isSmallScreen || isMediumScreen ? "100%" : "90%",
                    display: "flex",
                    flexDirection: isSmallScreen || isMediumScreen ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isSmallScreen ? "center" : "flex-start",
                    m: "auto",
                }}
            >
                {/* Bloco de Texto */}
                <Box
                    sx={{
                        textAlign: "justify",
                        width: isSmallScreen
                            ? "100%"
                            : isMediumScreen
                                ? "100%"
                                : "50%",
                        display: "flex",
                        flexDirection: "column",
                        m: "auto",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Passo 1
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                        }}
                        gutterBottom
                    >
                        Escolha o seu tipo de registo
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                        Nesta primeira etapa, queremos compreender melhor o tipo de registo que
                        pretende realizar. Irá registar-se como um indivíduo ou em nome de uma
                        empresa? Esta informação é essencial para podermos configurar corretamente
                        o seu perfil e garantir que todas as funcionalidades disponíveis são
                        ajustadas às suas necessidades específicas.
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, fontSize: "1.2rem" }}>
                        Preencha os campos necessários com as suas informações pessoais ou os
                        detalhes da sua empresa para avançar para a próxima fase do processo.
                    </Typography>
                </Box>

                {/* Bloco de Imagem */}
                <Box
                    component="img"
                    src="/images/Fase 1 - registoVendor.png"
                    alt="Imagem ilustrativa de registo"
                    sx={{
                        width: isSmallScreen || isMediumScreen ? "100%" : "40%",
                        objectFit: "cover",
                        borderRadius: "8px",
                        minHeight: "400px",
                        mt: isSmallScreen ? "5%" : isMediumScreen ? "0" : "10%",
                    }}
                />
            </Box>
        </Box>
    );
};
export default IntroStep1VendorRegister;
