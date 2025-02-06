import {
    Avatar,
    Button,
    Paper,
    Typography,
    Box,
    Divider, useMediaQuery,
} from "@mui/material";
import {observer} from "mobx-react";
import Carousel from "react-material-ui-carousel";
import {MapContainer, TileLayer, Marker} from "react-leaflet";
import {fixImagePath} from "../utils/utils.js";
import {useTheme} from "@mui/material/styles";
import React, {useState} from "react";
import DashboardStoreShortCutCard from "@/Components/DashboardStoreShortCutCard.jsx";
import ReactMarkdown from "react-markdown";
import DashboardProductList from "@/Components/DashboardProductList.jsx";
import DashboardStoreReviewList from "@/Components/DashboardStoreReviewList.jsx";
import DashboardStoreEditForm from "@/Components/DashboardStoreEditForm.jsx";
import {shopStore} from "@/Stores/index.js";
import DashboardImageCarousel from "@/Components/DashboardImageCarousel.jsx";

const DashboarShowStoreInfo = observer(({store}) => {

    const theme = useTheme();

    // Get media queries
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Faz a query para mobile
    const latitude = store?.latitude || 38.7071;
    const longitude = store?.longitude || -9.1355;

    const [showProductList, setShowProductList] = useState(false)
    // Função para lidar com o clique no card "Produtos"
    const handleProductCardClick = () => {
        setShowProductList(!showProductList); // Alterna entre mostrar/esconder
        setShowReviewList(false);
    };

    const [showReviewList, setShowReviewList] = useState(false);

    const handleReviewCardClick = () => {
        setShowReviewList(!showReviewList);
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
        console.log("Prepar imagens para apagar", deleteImages);
        return {
            newImages: newImages.filter(Boolean), // Filtra as novas imagens válidas
            deleteImages, // IDs das imagens a serem excluídas
        };
    };

    const handleSubmitEdit = async (updatedValues, existingImages, newImages, deleteImages) => {
        try {

            // Prepara as imagens corretamente
            const { newImages: preparedNewImages, deleteImages: preparedDeleteImages } = prepareImages(existingImages, newImages, deleteImages);

            // Adiciona as imagens ao updatedValues antes de enviar
            const formDataValues = {
                ...updatedValues,
                newImages: preparedNewImages,
                deleteImages: preparedDeleteImages,
            };

            const formData = new FormData();

            // Adicionar dados básicos
            for (const key in formDataValues) {
                if (key !== 'existingImages' && key !== 'newImages' && key !== 'deleteImages') {
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
            console.log("Apos adicionar imagem para apagar", formData)

            console.log("FormData preparado para envio: ", Array.from(formData.entries()));

            // Enviar para o backend
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
                width: "80%",
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
            {/* Carrossel */}
            <Box sx={{position: "relative", height: 200, overflow: "hidden"}}>
                <DashboardImageCarousel galleries={store?.galleries}/>
            </Box>

            {/* Nome da loja */}
            <Box
                sx={{
                    position: "absolute",
                    width: "100%",
                    top: "215px", // Ajustado para não ficar oculto
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
            {/* Conteúdo alternado: visualização ou formulário */}
            {!isEditing ? (
            <Box>
                <Box sx={{display: "flex", gap: 2, mb: 1, pt:3, flexDirection: isSmallScreen ? "column" : "row",}}>
                    {/* Informações da loja */}
                    <Box sx={{flex: "1 1 50%", marginBottom: "3%", p: 2}}>
                        {/* Linha 1 - Email & Telemóvel */}
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

                        {/* Linha 2 - Localidade & Código Postal */}
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

                        {/* Linha 3 - Morada */}
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

                        {/* Linha 4 - Descrição */}
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

                    {/* Localização no Mapa */}
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
            </Box>
            ):(
                <DashboardStoreEditForm
                    store={store}
                    onCancel={handleCancelEdit}
                    onSubmit={handleSubmitEdit} // Recebe as informações do formulário
                />
            )}

            <Divider/>

            {/* container dos cards*/}
            <Box sx={{pb:3}}>
                <DashboardStoreShortCutCard
                    store={store}
                    onProductClick={handleProductCardClick}
                    onReviewClick={handleReviewCardClick}
                />
            </Box>

            {/* Renderiza condicionalmente o DashboardProductList */}
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
        </Paper>
    );
});

export default DashboarShowStoreInfo;
