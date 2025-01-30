import React, {useEffect, useState} from "react";
import {observer} from "mobx-react";
import {usePage} from "@inertiajs/react";
import {Box, Paper, Typography, useMediaQuery, useTheme, Modal, CircularProgress, Button} from "@mui/material";
import DashboardStoresCard from "@/Components/DashboardStoresCard";
import {shopStore} from "@/Stores/index.js";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DashboardStoreStep2 from "@/Components/DashboardStoreStep2.jsx";
// Importa o componente do modal

const DashboardStorePage = observer(() => {
    const { user, stores: initialStores } = usePage().props;

    useEffect(() => {
        if (!shopStore.stores.length) {
            shopStore.setStoresData(initialStores);
        }
    }, [initialStores]);
    const stores = shopStore.stores// Carrega as lojas do backend


    console.log('Store id', stores.id);


    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Estado para controlar o modal
    const [openModal, setOpenModal] = useState(false);
    const [storeFormik, setStoreFormik] = useState(null); // Estado para gerir o formik
    const [images, setImages] = useState([]); // Estado para as imagens

    // Verifica se há menos de 3 lojas e adiciona espaços vazios para completar
    const displayedStores = [...shopStore.stores];
    while (displayedStores.length < 3) {
        displayedStores.push(null); // Adiciona um espaço vazio
    }


    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                newImages.push(reader.result); // Guarda a imagem Base64
                if (newImages.length === files.length) {
                    setImages((prevImages) => [...prevImages, ...newImages]);
                }
            };
            reader.readAsDataURL(file); // Converte para Base64
        });
    };


    const handleSave = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            if (!storeFormik || !storeFormik.values) {
                throw new Error("Os dados do formulário estão incompletos.");
            }

            // Combina os dados do Formik com as imagens
            const storeData = {
                ...storeFormik.values,
                image_link: images, // Adiciona as imagens ao payload
            };

            // Envia os dados para o backend
            const result = await shopStore.createStore(storeData);

            if (result.success) {
                console.log("Loja criada com sucesso:", result.store);
                setOpenModal(false); // Fecha o modal
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
        <Box sx={{position: "relative", width: "100%", height:"100%" ,display: "flex", justifyContent: "center", mt: 4,}}>
            {/* Título "A Minha Loja" sobre o Paper */}
            <Box
                sx={{
                    position: "absolute",
                    width: "72%",
                    top: -20, // Eleva a box sobre o Paper
                    left: "50%",
                    transform: "translateX(-50%)", // Centraliza horizontalmente
                    backgroundColor: theme.palette.primary.main, // Usa a cor principal do tema
                    color: theme.palette.primary.contrastText, // Contraste automático
                    padding: "12px 24px",
                    borderRadius: "8px",
                    textAlign: "left",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    boxShadow: 3, // Sombra para destacar
                    zIndex: 2, // Garante que fica sobre o Paper
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
                    width: isSmallScreen ? "100%" : "70%",
                    m: "auto",
                    display: "flex",
                    flexDirection: isSmallScreen ? "column" : "row",
                    height: "100%",
                    borderRadius: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
            >


                {/* Faz o loop para renderizar as Cards */}
                {stores.map((store) => (
                    <DashboardStoresCard key={store.id} store={store} user={user} />
                ))}
                {stores.length < 3 && (
                    <Box
                        onClick={() => setOpenModal(true)} // Abre o modal
                        sx={{

                            maxWidth: 300, // Igual ao card
                            width: "100%", // Ajusta ao espaço disponível
                            borderRadius: "16px", // Cantos arredondados iguais ao card
                            overflow: "hidden", // Mesma propriedade para garantir consistência
                            boxShadow: 3, // Sombra igual ao card
                            margin: "auto", // Centraliza horizontalmente
                            mt: 5, // Mesma margem superior do card
                            minHeight: 500, // Altura mínima garantida igual ao card
                            display: "flex", // Exibe o conteúdo em um layout flexível
                            flexDirection: "column", // Alinha conteúdo em coluna
                            alignItems: "center", // Centraliza o conteúdo horizontalmente
                            justifyContent: "center", // Centraliza o conteúdo verticalmente
                            backgroundColor: "#f5f5f5", // Fundo cinza claro
                            border: "2px dashed #9e9e9e", // Borda estilizada
                            cursor: "pointer", // Indica que é clicável
                            transition: "all 0.3s ease", // Suaviza as animações
                            "&:hover": {
                                backgroundColor: "#e0e0e0", // Fundo mais escuro no hover
                                transform: "scale(1.05)", // Leve aumento no hover
                            },
                        }}
                    >
                        <AddCircleIcon
                            sx={{
                                fontSize: 40, // Tamanho do ícone
                                color: "#757575", // Cor do ícone
                            }}
                        />
                        <Typography
                            sx={{
                                mt: 2, // Margem superior para separar do ícone
                                fontWeight: "bold", // Negrito no texto
                                color: "#757575", // Cor do texto
                                textAlign: "center", // Centraliza o texto
                            }}
                        >
                            Adicionar Loja
                        </Typography>
                    </Box>
                )}

                {/* Modal para adicionar loja */}
                <Modal
                    open={openModal}
                    onClose={() => setOpenModal(false)} // Fecha o modal
                    aria-labelledby="add-store-modal"
                    aria-describedby="add-store-modal-description"
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: isSmallScreen ? "90%" : "50%",
                            bgcolor: "background.paper",
                            borderRadius: "10px",
                            boxShadow: 24,
                            p: 4,
                        }}
                    >

                        <DashboardStoreStep2
                            setStoreFormik={setStoreFormik}
                            handleImageUpload={handleImageUpload}
                            images={images}/>


                        <Box sx={{display: "flex", justifyContent: "center", mt: 4}}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                disabled={isLoading}
                            >

                                {isLoading ? (
                                    <CircularProgress size={24} sx={{color: "white"}}/>
                                ) : (
                                    "Guardar"
                                )}
                            </Button>
                        </Box>

                        {/* Exibe mensagem de erro, se existir */}
                        {errorMessage && (
                            <Typography color="error" sx={{mt: 2, textAlign: "center"}}>
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

