import { observer } from "mobx-react";
import {Box, Paper, TextField, Typography, Button, Avatar, Alert, Fade} from "@mui/material";
import {useEffect, useState} from "react";
import {authStore} from "@/Stores/index.js";
import {router} from "@inertiajs/react";

const ProfileEdit = observer(({ user, errors }) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        date_of_birth: user.date_of_birth || "",
        phone: user.phone || "",
        photo: null, // Foto será atualizada pelo input de ficheiro
    });


    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await router.put(`/perfil/${user.id}/edit`, formData);

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            setError("Erro ao atualizar perfil. Verifique os campos obrigatórios.");
            setShowError(true);
        }
    };


    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setShowError(false);
            }, 4500);

            const clearTimer = setTimeout(() => {
                setError("");
            }, 5000);

            return () => {
                clearTimeout(timer);
                clearTimeout(clearTimer);
            };
        }
    }, [error]);

    return (
        <Paper elevation={8} sx={{ p: 2, width: "100%" }}>

            <Fade in={showError} timeout={{ enter: 50, exit: 500 }}>
                {error ? (
                    <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                ) : (
                    <Box sx={{ mb: 2, height: "48px" }}></Box>
                )}
            </Fade>
            <Typography variant="h5" align="center" gutterBottom sx={{ mb: 2 }}>
                Editar Perfil
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                    alt="Profile Image"
                    // src={testProfileImage}
                    variant="square"
                    sx={{
                        width: 100,
                        height: 100,
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
                    mt: 2,
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            required
                            label="Primeiro Nome"
                            name="first_name"
                            value={formData.first_name || ""}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData((prev) => ({ ...prev, [name]: value }));
                            }}
                            error={!!errors?.first_name}
                            helperText={errors?.first_name}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            required
                            label="Último Nome"
                            name="last_name"
                            value={formData.last_name || ""}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData((prev) => ({ ...prev, [name]: value }));
                            }}
                            error={!!errors?.last_name}
                            helperText={errors?.last_name}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            required
                            label="Email"
                            name="email"
                            value={formData.email || ""}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData((prev) => ({ ...prev, [name]: value }));
                            }}
                            error={!!errors?.email}
                            helperText={errors?.email}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Data de Nascimento"
                            name="date_of_birth"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formData.date_of_birth || ""}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData((prev) => ({ ...prev, [name]: value }));
                            }}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Numero de Telemovel"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData((prev) => ({ ...prev, [name]: value }));
                            }}
                            error={!!errors?.phone}
                            helperText={errors?.phone}
                        />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            label="Foto de Perfil"
                            name="photo"
                            type="file"
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    photo: e.target.files[0], // Atualiza apenas se um ficheiro for selecionado
                                }))
                            }

                        error={!!errors?.photo}
                            helperText={errors?.photo}
                        />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button type="submit" variant="contained">
                            Guardar
                        </Button>
                    </Box>
                </form>
            </Box>
        </Paper>
    );
});

export default ProfileEdit;
