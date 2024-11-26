import { Avatar, Button, Paper, Typography, Box } from "@mui/material";
import testProfileImage from "../../images/2.jpg";
import { authStore } from "../Stores";
import { observer } from "mobx-react";
import { alpha } from "@mui/material/styles";

const ProfileInformation = observer(({ user }) => {
    return (
        <>
            <Paper
                elevation={4}
                sx={{
                    p: 2,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    backgroundColor: (theme) =>
                        alpha(theme.palette.background.default, 0.85),
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar
                        alt="Profile Image"
                        src={testProfileImage}
                        sx={{ width: 96, height: 96, mt: 2 }}
                    />
                    <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                        {`${user.first_name} ${user.last_name}`}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "baseline",
                    }}
                >
                    <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                        Sou um apaixonado pela sustentabilidade, ideias
                        sustentáveis e pelo apoio ao comércio local. Acredito
                        que pequenas ações podem ter um grande impacto no
                        ambiente e na nossa comunidade. Gosto de descobrir novos
                        produtos locais e apoiar produtores e agricultores
                        regionais. Na Biorama, procuro inspirar outras pessoas a
                        fazer escolhas mais conscientes e a valorizar o que é
                        nosso. Quando não estou a explorar mercados e feiras
                        locais, gosto de passar tempo na natureza e aprender
                        mais sobre práticas de vida sustentável.
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "baseline",
                        mt: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Email:
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                        {user.email}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "baseline",
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                        Data de Nascimento:
                    </Typography>
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ mt: 1, ml: 1 }}
                    >
                        20/01/1990
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "baseline",
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                        Telefone:
                    </Typography>
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ mt: 1, ml: 1 }}
                    >
                        +351 123 456 789
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "baseline",
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                        Cidade:
                    </Typography>
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ mt: 1, ml: 1 }}
                    >
                        Setúbal
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "baseline",
                    }}
                >
                    <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                        Data de Registo:
                    </Typography>
                    <Typography
                        variant="body1"
                        gutterBottom
                        sx={{ mt: 1, ml: 1 }}
                    >
                        15/01/2025
                    </Typography>
                </Box>
                <Box sx={{ alignSelf: "flex-end", height: "50px" }}>
                    {authStore.authenticated ? (
                        <Button
                            variant="contained"
                            sx={{ mt: 2, width: "140px" }}
                        >
                            Editar Perfil
                        </Button>
                    ) : (
                        ""
                    )}
                </Box>
            </Paper>
        </>
    );
});

export default ProfileInformation;
