import {Box, Typography, useMediaQuery, useTheme} from '@mui/material';

const IntroStep3VendorRegister = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
    return (
        <Box sx={{mt: 4, px: 2}}>
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
                        Passo 3
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                        }}
                        gutterBottom
                    >
                        Crie e publique os seus produtos
                    </Typography>
                    <Typography variant="body1" sx={{fontSize: "1.2rem"}}>
                        Chegámos à etapa final! Agora que a sua loja está pronta, é o momento de colocar os produtos
                        "nas prateleiras" e dar vida ao seu negócio.
                    </Typography>
                    <Typography variant="body1" sx={{mt: 2, fontSize: "1.2rem"}}>
                        Nesta fase, irá adicionar os seus produtos, fornecendo todas as informações essenciais para que
                        os seus clientes saibam exatamente o que estão a comprar. Poderá descrever cada produto em
                        detalhe, destacando as suas características, benefícios e qualquer informação relevante que
                        ajude a conquistar a confiança do comprador.
                    </Typography>
                    <Typography variant="body1" sx={{mt: 2, fontSize: "1.2rem"}}>
                        Além da descrição, será necessário definir o preço de venda e a quantidade disponível em stock.
                        Estes detalhes são fundamentais para garantir que os clientes têm sempre acesso a informações
                        precisas e atualizadas sobre os seus produtos.
                    </Typography>
                    <Typography variant="body1" sx={{mt: 2, fontSize: "1.2rem"}}>
                        Por fim, e talvez o mais importante, poderá adicionar imagens de alta qualidade para mostrar os
                        seus produtos da melhor forma possível. Fotografias bem tiradas são a chave para captar o
                        interesse dos clientes e transmitir a qualidade do que está a vender.
                    </Typography>
                    <Typography variant="body1" sx={{mt: 2, fontSize: "1.2rem"}}>
                        Com tudo pronto, a sua loja estará oficialmente operacional e pronta para receber os primeiros
                        clientes. Agora é só gerir os seus produtos e começar a vender!
                    </Typography>
                </Box>
                <Box
                    component="img"
                    src="/images/Fase 3 - registoVendor.png"
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
}
export default IntroStep3VendorRegister;
