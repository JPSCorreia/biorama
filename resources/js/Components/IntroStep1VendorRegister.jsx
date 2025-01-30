import {Box, Grid2, Typography} from '@mui/material';

const IntroStep1VendorRegister = () => {

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
                        Passo 1
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                        }}
                        gutterBottom
                    >
                        Escolha como se deseja registar
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: "1.2rem" }}>
                        Nesta primeira etapa, queremos compreender melhor o tipo de registo que pretende realizar.
                        Irá registar-se como um indivíduo ou em nome de uma empresa? Esta informação é essencial
                        para podermos configurar corretamente o seu perfil e garantir que todas as funcionalidades
                        disponíveis são ajustadas às suas necessidades específicas.
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, fontSize: "1.2rem" }}>
                        Preencha os campos necessários com as suas informações pessoais ou os detalhes da sua empresa
                        para avançar para a próxima fase do processo.
                    </Typography>
                </Box>
                <Box
                    component="img"
                    src="/images/Fase1-registo vendor.png"
                    alt="Imagem ilustrativa de registo"
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
export default IntroStep1VendorRegister;
