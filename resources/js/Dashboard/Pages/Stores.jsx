import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";
import {
    Box,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
    Modal,
    CircularProgress,
    Button,
} from "@mui/material";
import {
    DashboardStoresCard,
    DashboardStoreStep2,
} from "@/Dashboard/Components/";
import { shopStore } from "@/Stores/index.js";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const Stores = observer(() => {

    const { user } = usePage().props;

    useEffect(() => {
            shopStore.fetchStores();
    }, []);

    const stores = shopStore.stores;

    console.log(stores)

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [storeFormik, setStoreFormik] = useState(null);
    const [images, setImages] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                newImages.push(reader.result);
                if (newImages.length === files.length) {
                    setImages((prevImages) => [...prevImages, ...newImages]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            if (!storeFormik) {
                throw new Error("O formulário não está inicializado.");
            }

            // Validação do formulário com Yup antes de enviar
            const errors = await storeFormik.validateForm();
            if (Object.keys(errors).length > 0) {
                storeFormik.setTouched(errors); // Mostra os erros no formulário
                setErrorMessage(
                    "Por favor, preencha corretamente todos os campos obrigatórios.",
                );
                setIsLoading(false);
                return; // Interrompe o envio se houver erros
            }

            const storeData = {
                ...storeFormik.values,
                image_link: images,
            };

            const result = await shopStore.createStore(storeData);

            if (result.success) {
                setOpenModal(false);
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            console.error("Erro ao criar a loja:", error.message);
            setErrorMessage(
                "Erro ao guardar a loja. Por favor, tenta novamente.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                mt: 4,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Header Section */}
            <Paper
                elevation={4}
                sx={{
                    width: "96%",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: 2,
                    borderRadius: "8px",
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Todas as Lojas
                </Typography>
            </Paper>

            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    my: 4,
                    width: "94%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                }}
            >
                {isLoading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            minHeight: "800px",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: smallerThanLarge ? 6 : 12,
                            py: 2,
                        }}
                    >
                        {stores.map((store) => (
                            <DashboardStoresCard
                                key={store?.id}
                                store={store}
                                user={user}
                            />
                        ))}

                        {stores.length < 3 && (
                            <Box
                                onClick={() => setOpenModal(true)}
                                sx={{
                                    maxWidth: 300,
                                    width: "100%",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    boxShadow: 3,
                                    minHeight: 592,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    // backgroundColor: "#f5f5f5",
                                    border: "2px dashed",
                                    borderColor: theme.palette.primary.main,
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: "#388e3c26",
                                        transform: "scale(1.05)",
                                    },
                                }}
                            >
                            <AddCircleIcon
                                sx={{ fontSize: 40, color: theme.palette.primary.main }}
                            />
                                <Typography
                                    sx={{
                                        mt: 2,
                                        fontWeight: "bold",
                                        color: theme.palette.primary.main,
                                        textAlign: "center",
                                    }}
                                >
                                    Adicionar Loja
                                </Typography>
                            </Box>
                        )}

                        <Modal
                            open={openModal}
                            onClose={() => setOpenModal(false)}
                            aria-labelledby="add-store-modal"
                            aria-describedby="add-store-modal-description"
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: isSmallScreen
                                        ? "100%"
                                        : isMediumScreen
                                          ? "100%"
                                          : "50%",
                                    bgcolor: "background.paper",
                                    borderRadius: "10px",
                                    boxShadow: 24,
                                    p: 4,
                                }}
                            >
                                <DashboardStoreStep2
                                    setStoreFormik={setStoreFormik}
                                    handleImageUpload={handleImageUpload}
                                    images={images}
                                    setImages={setImages}
                                />

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSave}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <CircularProgress
                                                size={24}
                                                sx={{ color: "white" }}
                                            />
                                        ) : (
                                            "Guardar"
                                        )}
                                    </Button>
                                </Box>

                                {errorMessage && (
                                    <Typography
                                        color="error"
                                        sx={{ mt: 2, textAlign: "center" }}
                                    >
                                        {errorMessage}
                                    </Typography>
                                )}
                            </Box>
                        </Modal>
                    </Box>
                )}
            </Paper>
        </Box>
    );
});

export default Stores;
