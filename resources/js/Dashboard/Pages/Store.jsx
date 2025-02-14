import {
    Button,
    Paper,
    Typography,
    IconButton,
    Box,
    Tooltip,
    useMediaQuery,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
    DashboardProductList,
    DashboardStoreReviewList,
    DashboardStoreEditForm,
    DashboardStoreShortCutCard,
} from "@/Dashboard/Components/";
import { shopStore } from "@/Stores/";
import { DashboardImageCarousel } from "@/Dashboard/Components/";
import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import DeleteIcon from "@mui/icons-material/Delete";

const Store = observer(() => {
    const theme = useTheme();

    const { store: inertiaStore } = usePage().props;

    const [loading, setLoading] = useState(true);

    const storeId =
        inertiaStore?.id || window.location.pathname.split("/").pop();

    // Encontrar o índice da loja com o ID correspondente
    const storeIndex = shopStore.stores.findIndex(
        (store) => store.id == storeId,
    );

    // Se encontrar a loja, obter os dados
    const store = storeIndex !== -1 ? shopStore.stores[storeIndex] : null;

    // Get media queries
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));
    const latitude = store?.addresses[0]?.latitude || 38.7071;
    const longitude = store?.addresses[0]?.longitude || -9.1355;

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 250);
        return () => clearTimeout(timer);
    }, []);

    const [showProductList, setShowProductList] = useState(false);
    const handleProductCardClick = () => {
        setShowProductList(true); // Alterna entre mostrar/esconder
        setShowReviewList(false);
    };

    const [showReviewList, setShowReviewList] = useState(false);
    const handleReviewCardClick = () => {
        setShowReviewList(true);
        setShowProductList(false); // Fecha o componente de produtos se estiver aberto
    };

    const [isEditing, setIsEditing] = useState(false);
    const handleEditClick = () => {
        setIsEditing(true); // Alterna para o modo de edição
    };

    const handleCancelEdit = () => {
        setIsEditing(false); // Volta para o modo de visualização
    };

    const prepareImages = (existingImages, newImages, deleteImages) => {
        return {
            newImages: newImages.filter(Boolean), // Filtra as novas imagens válidas
            deleteImages, // IDs das imagens a serem excluídas
        };
    };

    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const handleOpenConfirmModal = () => {
        setOpenConfirmModal(true);
    };
    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
    };

    const handleConfirmDelete = async () => {
        await shopStore.deleteStore(store.id);
        handleCloseConfirmModal();
    };

    const handleSubmitEdit = async (
        updatedValues,
        existingImages,
        newImages,
        deleteImages,
    ) => {
        try {
            // Prepara as imagens corretamente
            const {
                newImages: preparedNewImages,
                deleteImages: preparedDeleteImages,
            } = prepareImages(existingImages, newImages, deleteImages);

            // Adiciona as imagens ao updatedValues antes de enviar
            const formDataValues = {
                ...updatedValues,
                newImages: preparedNewImages,
                deleteImages: preparedDeleteImages,
            };

            const formData = new FormData();

            // Adicionar dados básicos
            for (const key in formDataValues) {
                if (
                    key !== "existingImages" &&
                    key !== "newImages" &&
                    key !== "deleteImages"
                ) {
                    formData.append(key, formDataValues[key]);
                }
            }

            // Adicionar novas imagens (base64)
            formDataValues.newImages.forEach((img, index) => {
                formData.append(`new_images[${index}]`, img);
            });

            // Adicionar imagens para exclusão (IDs)
            formDataValues.deleteImages.forEach((id, index) => {
                formData.append(`delete_images[${index}]`, id);
            });

            // console.log(formData);

            // const response = await axios.post(
            //     `/dashboard/lojas/editar/${store.id}`,
            //     formData
            // );

            // if (response.status === 200) {
            //     shopStore.updateStore(store.id, formData);
            //     setIsEditing(false);
            // } else {
            //     console.error("Erro ao atualizar a loja.");
            // }

            // Enviar para o backend
            const result = await shopStore.updateStore(
                store.id,
                formDataValues,
            );

            if (result.success) {
                setIsEditing(false);
                console.log(store);
            } else {
                console.error("Erro ao atualizar a loja.");
            }
        } catch (error) {
            console.error("Erro ao enviar dados para o backend:", error);
        }
    };

    if (!store) {
        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "500px",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

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
                    zIndex: 5,
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    {store?.name || "Nome da Loja"}
                </Typography>
            </Paper>
            <Paper
                elevation={4}
                sx={{
                    my: -6,
                    width: "94%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                }}
            >
                {/* Carrossel */}
                <DashboardImageCarousel galleries={store?.galleries} />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        px: 3,
                        pt: 0,
                        pb: 3,
                    }}
                >
                    {/* Conteúdo alternado: visualização ou formulário */}
                    {!isEditing ? (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            {/* Linha 4 - Descrição */}

                            <ReactMarkdown>
                                {store?.description || "Sem descrição"}
                            </ReactMarkdown>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    mb: 1,
                                    mt: 2,
                                    flexDirection: smallerThanMedium
                                        ? "column"
                                        : "row",
                                }}
                            >
                                {/* Informações da loja */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        width: smallerThanMedium
                                            ? "100%"
                                            : "400px",
                                        // flex: "1 1 18%",
                                    }}
                                >
                                    {/* Linha 1 - Nome, Email & Telemóvel */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            flexWrap: "wrap",
                                            gap: 5,
                                            mb: 5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography
                                                fontWeight="bold"
                                                sx={{ fontSize: "1.2rem" }}
                                            >
                                                Nome:
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "1rem",
                                                    mt: 0.5,
                                                }}
                                            >
                                                {store?.name || "Sem nome"}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography
                                                fontWeight="bold"
                                                sx={{ fontSize: "1.2rem" }}
                                            >
                                                Email:
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "1rem",
                                                    mt: 0.5,
                                                }}
                                            >
                                                {store?.email || "Sem email"}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Typography
                                                fontWeight="bold"
                                                sx={{ fontSize: "1.2rem" }}
                                            >
                                                Telefone:
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "1rem",
                                                    mt: 0.5,
                                                }}
                                            >
                                                {store?.phone_number ||
                                                    "Sem número de telemóvel"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Localização no Mapa */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "100%",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: "250px",
                                            width: "100%",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {loading ? (
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                                sx={{
                                                    minHeight: "400px",
                                                    mt: 22,
                                                }}
                                            >
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <MapContainer
                                                center={[
                                                    store?.addresses[0]
                                                        ?.latitude,
                                                    store?.addresses[0]
                                                        ?.longitude,
                                                ]}
                                                zoom={12}
                                                style={{
                                                    height: "100%",
                                                    width: "100%",
                                                }}
                                            >
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <Marker
                                                    position={[
                                                        latitude,
                                                        longitude,
                                                    ]}
                                                />
                                            </MapContainer>
                                        )}
                                    </Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ mt: 2, mb: 0.25 }}
                                    >
                                        {store?.addresses[0]?.street_address},{" "}
                                        {store?.addresses[0]?.postal_code} -{" "}
                                        {store?.addresses[0]?.city}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    mt: smallerThanMedium ? 2 : 1,
                                    // mb: 4,
                                }}
                            >
                                <Tooltip title="Apagar Loja">
                                    <IconButton
                                        aria-label="delete"
                                        onClick={handleOpenConfirmModal}
                                    >
                                        <DeleteIcon
                                            sx={{
                                                color: theme.palette.error.main,
                                            }}
                                        />
                                    </IconButton>
                                </Tooltip>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEditClick}
                                >
                                    Editar
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <DashboardStoreEditForm
                            store={store}
                            onCancel={handleCancelEdit}
                            onSubmit={handleSubmitEdit} // Recebe as informações do formulário
                        />
                    )}

                    {/* Delete confirmation  */}
                    <Dialog
                        open={openConfirmModal}
                        onClose={handleCloseConfirmModal}
                    >
                        <DialogTitle>Confirmar Ação</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Tem a certeza que pretende apagar a loja{" "}
                                <strong>{store?.name}</strong>? Esta ação não
                                pode ser desfeita.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleCloseConfirmModal}
                                color="secondary"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleConfirmDelete}
                                color="error"
                                variant="contained"
                            >
                                Apagar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Paper>
            <Box sx={{ width: "94%" }}>
                {/* container dos cards*/}
                <Box sx={{ pb: 3, mt: 11 }}>
                    <DashboardStoreShortCutCard
                        store={store}
                        onProductClick={handleProductCardClick}
                        onReviewClick={handleReviewCardClick}
                        highlightProductList={showProductList}
                        highlightReviewList={showReviewList}
                    />
                </Box>

                {/* Renderiza condicionalmente o DashboardProductList */}
                {showProductList && (
                    <Box sx={{ mt: 2 }}>
                        <DashboardProductList storeId={store.id} />
                    </Box>
                )}

                {showReviewList && (
                    <Box sx={{ mt: 2 }}>
                        <DashboardStoreReviewList storeId={store.id} />
                    </Box>
                )}
            </Box>
        </Box>
    );
});

export default Store;
