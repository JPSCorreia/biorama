import {Box, Grid, Typography} from '@mui/material';

const IntroStep1VendorRegister = () => {

    return (
        <Box sx={{ mt: 4, px: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                        Passo 1
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                        }}
                        gutterBottom
                    >
                        Escolha como se deseja registar
                    </Typography>
                    <Box
                        sx={{
                            textAlign: 'justify',
                            width: '90%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',

                        }}
                    >
                        <Typography variant="body1" sx={{fontSize: '1.2rem'}}>
                            Nesta primeira etapa, queremos compreender melhor o tipo de registo que pretende realizar.
                            Irá registar-se como um indivíduo ou em nome de uma empresa? Esta informação é essencial
                            para podermos configurar corretamente o seu perfil e garantir que todas as funcionalidades
                            disponíveis são ajustadas às suas necessidades específicas.
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 2, fontSize: '1.2rem'}}>
                            Preencha os campos necessários com as suas informações pessoais ou os detalhes da sua empresa
                            para avançar para a próxima fase do processo.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ width: '100%', height: '300px', bgcolor: '#f0f0f0' }} />
                </Grid>
            </Grid>
        </Box>
    );
}
export default IntroStep1VendorRegister;
