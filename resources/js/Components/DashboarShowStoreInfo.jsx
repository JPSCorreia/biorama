import {
    Button,
    Paper,
    Typography,
    Box,
    Divider, useMediaQuery, DialogTitle, Dialog, DialogActions, DialogContentText, DialogContent,
} from "@mui/material";
import {observer} from "mobx-react";
import {MapContainer, TileLayer, Marker} from "react-leaflet";
import {useTheme} from "@mui/material/styles";
import React, {useState} from "react";
import DashboardStoreShortCutCard from "@/Components/DashboardStoreShortCutCard.jsx";
import ReactMarkdown from "react-markdown";
import DashboardProductList from "@/Components/DashboardProductList.jsx";
import DashboardStoreReviewList from "@/Components/DashboardStoreReviewList.jsx";
import DashboardStoreEditForm from "@/Components/DashboardStoreEditForm.jsx";
import {shopStore} from "@/Stores/index.js";
import DashboardImageCarousel from "@/Components/DashboardImageCarousel.jsx";

/**
 * Component: DashboarShowStoreInfo
 * Description: Displays detailed information about a store, including its address, description, and map location.
 * Allows switching between view and edit modes and shows product/review lists.
 */
const DashboarShowStoreInfo = observer(({store}) => {

    const theme = useTheme();
    // Media query to detect small screens (mobile view)
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // Default latitude and longitude for the map
    const latitude = store?.latitude || 38.7071;
    const longitude = store?.longitude || -9.1355;

    // State to toggle product list visibility
    const [showProductList, setShowProductList] = useState(false)
    const handleProductCardClick = () => {
        setShowProductList(!showProductList);
        setShowReviewList(false);
    };

    // State to toggle review list visibility
    const [showReviewList, setShowReviewList] = useState(false);
    const handleReviewCardClick = () => {
        setShowReviewList(!showReviewList);
        setShowProductList(false);
    };

    // State to control the confirmation modal
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    // Handle open and close of the modal
    const handleOpenConfirmModal = () => {
        setOpenConfirmModal(true);
    };

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
    };

    // Handle deletion after confirmation
    const handleConfirmDelete = async () => {
        await shopStore.DeleteStore(store.id);
        handleCloseConfirmModal();
    };

    // State to manage edit mode
    const [isEditing, setIsEditing] = useState(false);
    const handleEditClick = () => {
        setIsEditing(true);// Switch to edit mode
    };
    const handleCancelEdit = () => {
        setIsEditing(false); // Switch back to view mode
    };

    /**
     * Prepare the images for submission by filtering valid new images and collecting images to delete.
     */
    const prepareImages = (existingImages, newImages, deleteImages) => {
        console.log("Prepar imagens para apagar", deleteImages);
        return {
            newImages: newImages.filter(Boolean),
            deleteImages,
        };
    };

    /**
     * Handle the submission of the store edit form.
     * Collects all updated store data and sends it to the backend.
     */
    const handleSubmitEdit = async (updatedValues, existingImages, newImages, deleteImages) => {
        try {

            const { newImages: preparedNewImages, deleteImages: preparedDeleteImages } = prepareImages(existingImages, newImages, deleteImages);

            // Add the images to updatedvalues before sending them
            const formDataValues = {
                ...updatedValues,
                newImages: preparedNewImages,
                deleteImages: preparedDeleteImages,
            };

            const formData = new FormData();

            // Add basic data
            for (const key in formDataValues) {
                if (key !== 'existingImages' && key !== 'newImages' && key !== 'deleteImages') {
                    formData.append(key, formDataValues[key]);
                }
            }

            // Add new images (base64)
            formDataValues.newImages.forEach((img, index) => {
                formData.append(`new_images[${index}]`, img);
            });

            // Add images to delete (IDs)
            formDataValues.deleteImages.forEach((id, index) => {
                formData.append(`delete_images[${index}]`, id);
            });


            // Send the form data to the backend
            const result = await shopStore.updateStore(store.id, formData);
            if (result.success) {
                console.log("Loja atualizada com sucesso!");
                setIsEditing(false);
            } else {
                console.error("Erro ao atualizar a loja.");
            }
        } catch (error) {
            console.error("Erro ao enviar dados para o backend:", error);
        }
    };


    return (
        <Paper
            elevation={4}
            sx={{
                p: 2,
                width: "95%",
                m: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                position: "relative", // Adiciona posição relativa ao Paper
            }}
        >
            {/* Image carousel displaying the store gallery */}
            <Box sx={{position: "relative", height: 200, overflow: "hidden"}}>
                <DashboardImageCarousel galleries={store?.galleries}/>
            </Box>

            {/* Store name section */}
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    top: "215px",
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
                    <strong>{store?.name || "Nome da Loja"}</strong>
                </Typography>
            </Box>

            <Divider/>

            {/* Conditionally render view or edit mode */}
            {!isEditing ? (
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mb: 1,
                        pt:3,
                        flexDirection: isSmallScreen ? "column" : "row",
                    }}>
                    {/* Store information section */}
                    <Box sx={{flex: "1 1 50%", marginBottom: "3%", p: 2}}>

                        <Box sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 3
                        }}>
                            <Box sx={{flex: "1 1 45%"}}>
                                <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Email:</Typography>
                                <Typography sx={{fontSize: "1rem"}}>{store?.email || "Sem email"}</Typography>
                            </Box>
                            <Box sx={{flex: "1 1 45%"}}>
                                <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Telemóvel:</Typography>
                                <Typography
                                    sx={{fontSize: "1rem"}}>{store?.phone_number || "Sem número de telemóvel"}</Typography>
                            </Box>
                        </Box>


                        <Box sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 3
                        }}>
                            <Box sx={{flex: "1 1 45%"}}>
                                <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Localidade:</Typography>
                                <Typography sx={{fontSize: "1rem"}}>
                                    {store?.addresses?.[0]?.city || "Código postal não disponível"}
                                </Typography>
                            </Box>
                            <Box sx={{flex: "1 1 45%"}}>
                                <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Código Postal:</Typography>
                                <Typography sx={{fontSize: "1rem"}}>
                                    {store?.addresses?.[0]?.postal_code || "Não disponível"}
                                </Typography>
                            </Box>
                        </Box>


                        <Box sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 3
                        }}>
                            <Box sx={{flex: "1 1 45%"}}>
                                <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Morada:</Typography>
                                <Typography sx={{fontSize: "1rem"}}>
                                    {store?.addresses?.[0]?.street_address || "Código postal não disponível"}
                                </Typography>
                            </Box>
                        </Box>


                        <Box sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 3
                        }}>
                            <Box sx={{flex: "1 1 45%"}}>
                                <Typography fontWeight="bold" sx={{fontSize: "1.2rem"}}>Descrição:</Typography>
                                <ReactMarkdown>
                                    {store?.description || "Sem descrição"}
                                </ReactMarkdown>
                            </Box>
                        </Box>
                    </Box>

                    {/* Map location */}
                    <Box sx={{flex: "1 1 50%"}}>
                        <Typography variant="h5" sx={{mb: 2}}>
                            Localização no Mapa
                        </Typography>
                        <Box sx={{height: "400px", width: "100%", borderRadius: "8px", overflow: "hidden"}}>
                            <MapContainer center={[latitude, longitude]} zoom={13} style={{height: "100%", width: "100%"}}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                <Marker position={[latitude, longitude]}/>
                            </MapContainer>
                        </Box>
                    </Box>

                </Box>
                <Box sx={{mt: 1, textAlign: "right"}}>
                    <Button variant="contained" color="primary"  onClick={handleEditClick} >Editar</Button>
                </Box>
                <Box sx={{mt: 1, textAlign: "right"}}>
                    <Button variant="contained" color="error"  onClick={handleOpenConfirmModal} >Apagar Loja</Button>
                </Box>
            </Box>
            ):(
                <DashboardStoreEditForm
                    store={store}
                    onCancel={handleCancelEdit}
                    onSubmit={handleSubmitEdit}
                />
            )}

            <Divider/>

            {/* Shortcut cards for products,reviews and orders */}
            <Box sx={{pb:3}}>
                <DashboardStoreShortCutCard
                    store={store}
                    onProductClick={handleProductCardClick}
                    onReviewClick={handleReviewCardClick}
                />
            </Box>

            {/* Conditionally render product list or review list */}
            {showProductList && (
                <Box sx={{ mt: 2 }}>
                    <DashboardProductList
                        storeId={store.id}/>
                </Box>
            )}

            {showReviewList && (
                <Box sx={{ mt: 2 }}>
                    <DashboardStoreReviewList storeId={store.id} />
                </Box>
            )}

            {/* Delete confirmation  */}
            <Dialog open={openConfirmModal} onClose={handleCloseConfirmModal}>
                <DialogTitle>Confirmar Ação</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Tem a certeza que pretende apagar a loja <strong>{store?.name}</strong>? Esta ação não pode ser desfeita.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmModal} color="secondary">Cancelar</Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">Apagar</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
});

export default DashboarShowStoreInfo;
