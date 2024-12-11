import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
    Paper,
    Fade,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import {router} from "@inertiajs/react";

const VendorRegister = () => {
    const [formData, setFormData] = useState({});

    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    // Função para criar o FormData a partir do objeto
    const createFormData = (data) => {

        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
                // Se for a checkbox, precisa de transformar para '1' ou '0'
                if (typeof data[key] === 'boolean') {
                    formData.append(key, data[key] ? '1' : '0');
                } else {
                    formData.append(key, data[key]);
                }
            }
        });
        return formData;
    };

    // Função para manipular o registo
    const handleVendorRegister = (e) => {
        e.preventDefault();

        // Clear any previous error before submitting the form
        setError("");
        setShowError(false);

        const data = createFormData(formData);

        console.log(data);
        router.post('/registarVendedor', data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

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
                    <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
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
                <Paper elevation={8} sx={{p: 2, width: "100%"}}>
                    <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{mb: 2}}
                    >
                        Registo de Vendedor
                    </Typography>

                    <form onSubmit={handleVendorRegister}>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                            <TextField
                                fullWidth
                                label="NIF"
                                name="nif"
                                variant="outlined"
                                required
                                value={formData.nif || ""}
                                onChange={(e) => {
                                    const {name, value} = e.target;
                                    setFormData((prev) => ({...prev, [name]: value}));
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Telefone"
                                name="phone"
                                variant="outlined"
                                required
                                value={formData.phone || ""}
                                onChange={(e) => {
                                    const {name, value} = e.target;
                                    setFormData((prev) => ({...prev, [name]: value}));
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Morada"
                                name="address"
                                variant="outlined"
                                required
                                value={formData.address || ""}
                                onChange={(e) => {
                                    const {name, value} = e.target;
                                    setFormData((prev) => ({...prev, [name]: value}));
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Código Postal"
                                name="postal_code"
                                variant="outlined"
                                required
                                value={formData.postal_code || ""}
                                onChange={(e) => {
                                    const {name, value} = e.target;
                                    setFormData((prev) => ({...prev, [name]: value}));
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Cidade"
                                name="city"
                                variant="outlined"
                                required
                                value={formData.city || ""}
                                onChange={(e) => {
                                    const {name, value} = e.target;
                                    setFormData((prev) => ({...prev, [name]: value}));
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Data de Nascimento"
                                name="date_of_birth"
                                type="date"
                                InputLabelProps={{shrink: true}}
                                variant="outlined"
                                required
                                value={formData.date_of_birth || ""}
                                onChange={(e) => {
                                    const {name, value} = e.target;
                                    setFormData((prev) => ({...prev, [name]: value}));
                                }}
                            />
                            <TextField
                                fullWidth
                                label="IBAN"
                                name="iban"
                                variant="outlined"
                                required
                                value={formData.iban || ""}
                                onChange={(e) => {
                                    const {name, value} = e.target;
                                    setFormData((prev) => ({...prev, [name]: value}));
                                }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.is_company || false}
                                        onChange={(e) => {
                                            const {name, checked} = e.target;
                                            setFormData((prev) => ({...prev, [name]: checked}));
                                        }}
                                        name="is_company"
                                    />
                                }
                                label="É uma empresa?"
                            />
                            {formData.is_company && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Nome da Empresa"
                                        name="company_name"
                                        variant="outlined"
                                        required
                                        value={formData.company_name || ""}
                                        onChange={(e) => {
                                            const {name, value} = e.target;
                                            setFormData((prev) => ({...prev, [name]: value}));
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="NIF da Empresa"
                                        name="company_nif"
                                        variant="outlined"
                                        required
                                        value={formData.company_nif || ""}
                                        onChange={(e) => {
                                            const {name, value} = e.target;
                                            setFormData((prev) => ({...prev, [name]: value}));
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Morada da Empresa"
                                        name="company_address"
                                        variant="outlined"
                                        value={formData.company_address || ""}
                                        onChange={(e) => {
                                            const {name, value} = e.target;
                                            setFormData((prev) => ({...prev, [name]: value}));
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Código Postal da Empresa"
                                        name="company_postal_code"
                                        variant="outlined"
                                        value={formData.company_postal_code || ""}
                                        onChange={(e) => {
                                            const {name, value} = e.target;
                                            setFormData((prev) => ({...prev, [name]: value}));
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Telefone da Empresa"
                                        name="company_phone"
                                        variant="outlined"
                                        value={formData.company_phone || ""}
                                        onChange={(e) => {
                                            const {name, value} = e.target;
                                            setFormData((prev) => ({...prev, [name]: value}));
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email da Empresa"
                                        name="company_email"
                                        variant="outlined"
                                        value={formData.company_email || ""}
                                        onChange={(e) => {
                                            const {name, value} = e.target;
                                            setFormData((prev) => ({...prev, [name]: value}));
                                        }}
                                    />
                                </>
                            )}
                            <TextField
                                fullWidth
                                label="Fotografia do Vendedor"
                                name="vendor_photo"
                                type="file"
                                InputLabelProps={{shrink: true}}
                                variant="outlined"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        vendor_photo: e.target.files[0],
                                    }))
                                }
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{pt: 1}}
                            >
                                Registar como Vendedor
                            </Button>
                        </Box>
                    </form>

                </Paper>
            </Box>
        </Container>
    );
};

export default VendorRegister;
