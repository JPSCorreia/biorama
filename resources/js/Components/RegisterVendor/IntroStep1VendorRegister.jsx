import {Box, Typography, useMediaQuery, useTheme} from '@mui/material';

const IntroStep1VendorRegister = () => {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const smallerThanXl = useMediaQuery(theme.breakpoints.down("xl"));


    return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection:  "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    // "& > :first-of-type": {
                    //     mb: 4,
                    // },
                    minHeight: "67.6vh",
                }}
            >
                {/* Bloco de Texto */}
                <Box
                    sx={{
                        textAlign: "justify",
                        display: "flex",
                        justifyContent: "flex-start",
                        pl: smallerThanXl ? 0 : 8,
                        mb: smallerThanXl ? 2 : 0,
                        pt: smallerThanXl? 0 : 12,
                        flexGrow: 1,
                        minHeight: "600px",
                        maxWidth: smallerThanXl ? "100%" : "50%",
                        flexDirection: "column",
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
                        mt: 2,
                        maxWidth: "700px",
                        display: smallerThanXl ? "none" : "block",
                    }}
                />
            </Box>
    );
};
export default IntroStep1VendorRegister;
