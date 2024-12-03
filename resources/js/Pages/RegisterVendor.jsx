import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
    Paper,
    Fade,
    Switch,
    FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";


const RegisterVendor = () => {
    const [formData, setFormData] = useState({
        tax_id: "",
        phone: "",
        address: "",
        date_of_birth: "",
        iban: "",
        is_company: false,
        company_name: "",
        company_tax_id: "",
        company_address: "",
        company_phone: "",
        company_email: "",
    });

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
        if (!csrfMetaTag) {
            console.error("Meta tag CSRF não encontrada no DOM.");
        } else {
            const csrfToken = csrfMetaTag.content;
        }

        router.post('/vendors', formData, {
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
            onSuccess: () => {
                console.log("Vendor registration successful!");
            },
            onError: (errors) => {
                console.error("Registration errors:", errors);
            },
        });
    };

    // Clear the error message automatically after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setShowError(false); // Start the fade-out
            }, 4500); // After 4.5 seconds, start the fade

            const clearTimer = setTimeout(() => {
                setError(""); // Clear the error message
            }, 5000); // After 5 seconds, clear the error message completely

            return () => {
                clearTimeout(timer);
                clearTimeout(clearTimer);
            };
        }
    }, [error]);

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "40px !important",
            }}
        >
            <Fade in={showError} timeout={{ enter: 50, exit: 500 }}>
                {error ? (
                    <Alert
                        severity="error"
                        variant="filled"
                        sx={{
                            mb: 2,
                            height: "48px",
                            width: "100%",
                            maxWidth: "470px",
                        }}
                    >
                        {error}
                    </Alert>
                ) : (
                    <Box sx={{ mb: 2, height: "48px" }}></Box>
                )}
            </Fade>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                    maxWidth: "470px",
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        p: 2,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "card.background",
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{ mb: 2 }}
                    >
                        Torne-se um vendedor
                    </Typography>

                    <form onSubmit={handleRegister}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            {/* Dados pessoais */}
                            <TextField
                                fullWidth
                                label="NIF"
                                variant="outlined"
                                required
                                value={formData.tax_id}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        tax_id: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Telefone"
                                variant="outlined"
                                required
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        phone: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Morada"
                                variant="outlined"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        address: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Data de nascimento"
                                type="date"
                                variant="outlined"
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={formData.date_of_birth}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        date_of_birth: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                label="IBAN"
                                variant="outlined"
                                required
                                value={formData.iban}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        iban: e.target.value,
                                    })
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.is_company}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                is_company: e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="É uma empresa?"
                            />

                            {/*Campos relativos à empresa (condicional)*/}
                            {formData.is_company && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Nome da empresa"
                                        variant="outlined"
                                        required={formData.is_company}
                                        value={formData.company_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company_name: e.target.value,
                                            })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        label="NIF da empresa"
                                        variant="outlined"
                                        required={formData.is_company}
                                        value={formData.company_tax_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company_tax_id: e.target.value,
                                            })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        label="Morada da empresa"
                                        variant="outlined"
                                        value={formData.company_address}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company_address: e.target.value,
                                            })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        label="Telefone da empresa"
                                        variant="outlined"
                                        value={formData.company_phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company_phone: e.target.value,
                                            })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email da empresa"
                                        type="email"
                                        variant="outlined"
                                        value={formData.company_email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company_email: e.target.value,
                                            })
                                        }
                                    />
                                </>
                            )}

                            <TextField
                                type="file"
                                inputProps={{ accept: "image/*" }}
                                fullWidth
                                variant="outlined"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        vendor_photo: e.target.files[0], // Salva o ficheiro no estado
                                    })
                                }
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ pt: 1, maxWidth: "360px" }}
                            >
                                Registar como vendedor
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterVendor;
