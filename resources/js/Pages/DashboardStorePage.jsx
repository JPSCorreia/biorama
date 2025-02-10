import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {usePage} from "@inertiajs/react";
import {Box, Paper, Typography, useMediaQuery, useTheme, Modal, CircularProgress, Button} from "@mui/material";
import DashboardStoresCard from "@/Components/DashboardStoresCard";
import {shopStore} from "@/Stores/index.js";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DashboardStoreStep2 from "@/Components/DashboardStoreStep2.jsx";

const DashboardStorePage = observer(() => {
    const {user, stores: initialStores} = usePage().props;

    useEffect(() => {
        if (!shopStore.stores.length) {
            shopStore.setStoresData(initialStores);
        }
    }, [initialStores]);

    const stores = shopStore.stores;

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [storeFormik, setStoreFormik] = useState(null);
    const [images, setImages] = useState([]);

    const displayedStores = [...shopStore.stores];
    while (displayedStores.length < 3) {
        displayedStores.push(null);
    }

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
                setErrorMessage("Por favor, preencha corretamente todos os campos obrigatórios.");
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
            setErrorMessage("Erro ao guardar a loja. Por favor, tenta novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                mt: 4,
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    width: "72%",
                    top: -20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: "12px 24px",
                    borderRadius: "8px",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    boxShadow: 3,
                    zIndex: 2,
                }}
            >
                <Typography variant="h5" fontWeight="bold">
                    As Minhas Lojas
                </Typography>
            </Box>

            <Paper
                elevation={4}
                sx={{
                    p: 2,
                    width: isSmallScreen ? "100%" : isMediumScreen ? "100%" : "70%",
                    m: "auto",
                    display: "flex",
                    flexDirection: isSmallScreen || isMediumScreen ? "column" : "row",
                    height: "100%",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
            >
                {stores.map((store) => (
                    <DashboardStoresCard key={store?.id} store={store} user={user} />
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
                            margin: "auto",
                            mt: 5,
                            minHeight: 640,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f5f5f5",
                            border: "2px dashed #9e9e9e",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "#e0e0e0",
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        <AddCircleIcon
                            sx={{
                                fontSize: 40,
                                color: "#757575",
                            }}
                        />
                        <Typography
                            sx={{
                                mt: 2,
                                fontWeight: "bold",
                                color: "#757575",
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
                            width: isSmallScreen ? "100%" : isMediumScreen ? "100%" : "50%",
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

                        <Box sx={{ display: "flex", justifyContent: "center"}}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} sx={{ color: "white" }} />
                                ) : (
                                    "Guardar"
                                )}
                            </Button>
                        </Box>

                        {errorMessage && (
                            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                                {errorMessage}
                            </Typography>
                        )}
                    </Box>
                </Modal>
            </Paper>
        </Box>
    );
});

export default DashboardStorePage;
