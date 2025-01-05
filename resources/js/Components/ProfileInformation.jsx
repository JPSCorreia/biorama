import { Avatar, Button, Paper, Typography, Box } from "@mui/material";
import { authStore } from "../Stores";
import { observer } from "mobx-react";
import { alpha } from "@mui/material/styles";
import {router} from "@inertiajs/react";


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
                        // src={testProfileImage}
                        variant = "square"
                        sx={{
                            mt: 2,
                            width: 96,
                            height: 96,
                            color: "background.default",
                            bgcolor: "primary.main",
                            fontSize: "3rem",
                        }}
                    >
                        {authStore.user?.first_name[0]}
                        {authStore.user?.last_name[0]}
                    </Avatar>
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
                        mt: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Primeiro Nome:
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                        {user.first_name}
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
                        Apelido:
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                        {user.last_name}
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
                        {
                            user.date_of_birth === null ? "Não Fornecida" : user.date_of_birth
                        }
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
                        {
                            user.phone === null ? "Não Fornecido" : user.phone
                        }
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
                        {user.created_at}
                    </Typography>
                </Box>
                <Box sx={{ alignSelf: "flex-end", height: "50px" }}>
                    {authStore.isAuthenticated ? (
                        <Button
                            variant="contained"
                            sx={{ mt: 2, width: "140px" }}
                            onClick={() => router.get('/perfil/edit')}
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
