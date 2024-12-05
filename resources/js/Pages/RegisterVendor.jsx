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
import {router, usePage} from "@inertiajs/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {route} from "ziggy-js";


const RegisterVendor = () => {

    const props = usePage().props;
    const csrfToken = props.csrf_token;

    useEffect(() => {
        console.log("CSRF Token:", csrfToken);
    }, [csrfToken]);

    const [formData, setFormData] = useState({
        nif: "",
        phone: "",
        address: "",
        postal_code: '',
        date_of_birth: "",
        iban: "",
        is_company: false,
        company_name: "",
        company_nif: "",
        company_address: "",
        company_postal_code: "",
        company_phone: "",
        company_email: "",
        vendor_photo: null, // Adicionado para o upload de ficheiros
    });

    const [errors, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [processing, setProcessing] = useState(false); // Adiciona o estado processing

    const handleRegister = async (e) => {
        e.preventDefault();


        console.log("Token CSRF:",csrfToken)
        setProcessing(true);

        // Prepara os dados do formulário
        const formDataToSend = new FormData();
        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }


            router.post('/vendedores', formDataToSend, {
                headers: {
                    'X-CSRF-TOKEN': props.csrf_token,
                    'Content-Type': 'multipart/form-data',
                },
            });

    };



    // Clear the error message automatically after 5 seconds
    useEffect(() => {
        if (errors) {
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
    }, [errors]);

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
            {errors && Object.keys(errors).length > 0 && (
                <Fade in timeout={{ enter: 50, exit: 500 }}>
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
                        {Object.values(errors).join(", ")}
                    </Alert>
                </Fade>
            )}
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

                    <form
                        onSubmit={handleRegister}
                        method="POST"
                        encType="multipart/form-data"
                    >
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
                                value={formData.nif}
                                onChange={(e) => setFormData({
                                        ...formData,
                                        "nif": e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Telefone"
                                variant="outlined"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({
                                        ...formData,
                                        "phone": e.target.value,
                                    })
                                }
                            />

                            <TextField
                                fullWidth
                                label="Morada"
                                variant="outlined"
                                value={formData.address}
                                onChange={(e) =>setFormData({
                                    ...formData,
                                    "address": e.target.value,
                                })
                            }
                            />

                            <TextField
                                fullWidth
                                label="Código-Postal"
                                variant="outlined"
                                required
                                value={formData.postal_code}
                                onChange={(e) => setFormData({
                                        ...formData,
                                        "postal_code": e.target.value,
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
                                onChange={(e) => setFormData({
                                        ...formData,
                                        "date_of_birth": e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                label="IBAN"
                                variant="outlined"
                                required
                                value={formData.iban}
                                onChange={(e) => setFormData({
                                        ...formData,
                                        "iban": e.target.value,
                                    })
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.is_company}
                                        onChange={(e) => setFormData({
                                                ...formData,
                                                "is_company": e.target.checked,
                                            })
                                        }
                                    />
                                }
                                label="É uma empresa?"
                            />

                            {/* Campos relativos à empresa (condicional) */}
                            {formData.is_company && (
                                <>
                                    <TextField
                                        fullWidth
                                        label="Nome da empresa"
                                        variant="outlined"
                                        required
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({
                                                ...formData,
                                                "company_name": e.target.value,
                                            })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        label="NIF da empresa"
                                        variant="outlined"
                                        required
                                        value={formData.company_nif}
                                        onChange={(e) => setFormData({
                                                ...formData,
                                                "company_nif": e.target.value,
                                            })
                                        }
                                    />
                                    <TextField
                                        fullWidth
                                        label="Morada da empresa"
                                        variant="outlined"
                                        value={formData.company_address}
                                        onChange={(e) => setFormData({
                                                ...formData,
                                                "company_address": e.target.value,
                                            })
                                        }
                                    />

                                    <TextField
                                        fullWidth
                                        label="Código Postal da empresa"
                                        variant="outlined"
                                        value={formData.company_postal_code}
                                        onChange={(e) => setFormData({
                                                ...formData,
                                                "company_postal_code": e.target.value,
                                            })
                                        }
                                    />

                                    <TextField
                                        fullWidth
                                        label="Telefone da empresa"
                                        variant="outlined"
                                        value={formData.company_phone}
                                        onChange={(e) => setFormData({
                                                ...formData,
                                                "company_phone": e.target.value,
                                            })
                                        }
                                    />

                                    <TextField
                                        fullWidth
                                        label="Email da empresa"
                                        type="email"
                                        variant="outlined"
                                        value={formData.company_email}
                                        onChange={(e) => setFormData({
                                                ...formData,
                                                "company_email": e.target.value,
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
                                onChange={(e) => setFormData({
                                        ...formData,
                                        "company_email": e.target.value,
                                    })
                                }
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={processing}
                                sx={{ pt: 1, maxWidth: "360px" }}
                            >
                                {processing ? "A processar..." : "Registar como vendedor"}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterVendor;
