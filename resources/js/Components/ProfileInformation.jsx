import {Avatar, Button, Paper, Typography, Box, Divider, ListItem, List, useTheme} from "@mui/material";
import { authStore } from "../Stores";
import { observer } from "mobx-react";
import { alpha } from "@mui/material/styles";
import {router} from "@inertiajs/react";
import React from "react";
import AddressModal from "./AddressModal.jsx";
import AddressCard from "./Addresscard.jsx";


const ProfileInformation = observer(({ user }) => {

    const theme = useTheme();

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    function calcularTempoRegisto(dataCriacao) {
        const dataAtual = new Date(); // Data atual
        const dataRegisto = new Date(dataCriacao); // Data de registo a partir da string fornecida
        // Diferença em milissegundos
        const diferencaMs = dataAtual - dataRegisto;

        // Conversão para dias
        const diasTotais = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

        // Cálculo de anos e dias restantes
        let anos = Math.floor(diasTotais / 365);
        let dias = diasTotais % 365;

        // Retorna a string formatada
        if (anos === 1 && dias === 1) {
            return `${anos} ano e ${dias} dia`;
        }
        else if (anos > 1 && dias === 1) {
            return `${anos} anos e ${dias} dia`;
        }
        else if (anos > 1 && dias > 1) {
            return `${anos} anos e ${dias} dias`;
        }
        else if (dias === 1) {
            return `${dias} dia`;
        }
        else {
            return `${dias} dias`;
        }
    }
    return (
        <>
            <Paper
                elevation={4}
                sx={{
                    p: 2,
                    width: "80%",
                    m:"auto",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    borderRadius: "10px",
                }}
            >
                {/* Avatar e Nome */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center", // Centraliza o nome ao meio da imagem
                        width: "100%",
                        mb:3
                    }}
                >
                    <Avatar
                        alt="Profile Image"
                        // src={testProfileImage}
                        variant="square"
                        sx={{
                            width: 120,
                            height: 120,
                            color: "background.secondary",
                            bgcolor: "primary.main",
                            fontSize: "3rem",
                            borderRadius: "10px",
                        }}
                    >
                        {authStore.user?.first_name[0]}
                        {authStore.user?.last_name[0]}
                    </Avatar>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                ml: 2, // Espaço entre a imagem e o nome
                                display: "flex",
                                alignItems: "center", // Centraliza verticalmente o nome em relação à imagem
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "2.3rem",
                                }}
                            >
                                {user.first_name} {user.last_name}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                alignSelf: "flex-end",
                                height: "50px",
                                display: "flex", // Define um layout flexível
                                justifyContent: "center", // Centraliza horizontalmente
                                alignItems: "center", // Centraliza verticalmente
                            }}
                        >
                            {authStore.isAuthenticated ? (
                                <Button
                                    variant="contained"
                                    sx={{
                                        width: "140px",
                                        alignContent: "center",
                                        mr: 6,
                                    }}
                                    onClick={() => router.get('/perfil/edit')}
                                >
                                    Editar Perfil
                                </Button>
                            ) : (
                                ""
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* Lista Alinhada */}
                <Box
                    sx={{
                        width: "76%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        m: "auto",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            fontSize: "1.8rem",
                        }}
                    >
                       Dados Pessoais
                    </Typography>
                    <List
                        sx={{
                            width: "100%",
                            justifyContent: "center",
                        }}
                    >
                        <ListItem
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                p: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "1.3rem",
                                    }}
                                >
                                    Email
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ ml: 1 }}
                                >
                                    {user.email}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    Nº de Telemóvel
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ mt: 1, ml: 1 }}
                                >
                                    {user.phone === null ? "Não Fornecido" : user.phone}
                                </Typography>
                            </Box>
                        </ListItem>
                        <Divider
                            variant="middle"
                            sx={{
                                width: "100%",
                                mt: 1.5,
                                background: "linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent)",
                                border: "none",
                                height: 1.5,
                            }}
                        />
                        <ListItem
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                p: 0,
                                mt: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "1.3rem",
                                    }}
                                >
                                    Data de Nascimento:
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ ml: 1 }}
                                >
                                    {user.date_of_birth ? user.date_of_birth : "Não Fornecida"}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    Tempo de Registo
                                </Typography>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{ mt: 1, ml: 1 }}
                                >
                                    {calcularTempoRegisto(user.created_at)}
                                </Typography>

                            </Box>
                        </ListItem>
                    </List>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            mt: 4,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: "1.8rem",
                                mb: 2,
                                width:"100%"
                            }}
                        >
                            Gestão de Moradas
                        </Typography>
                    </Box>
                    {
                        user.home_addresses.length > 0 ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row", // Alinha os itens na horizontal
                                    alignItems: "center", // Centraliza os itens verticalmente
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                }}
                            >
                                {/* Renderizar os AddressCards */}
                                {user.home_addresses.map((address) => (
                                    <AddressCard key={address.id} address={address} theme={theme} />
                                ))}

                                {/* Mostrar o botão "Adicionar Morada" apenas se houver menos de 3 moradas */}
                                {user.home_addresses.length < 3 && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<span style={{ fontSize: "1rem", fontWeight: "bold" }}>+</span>}
                                        sx={{
                                            color: theme.palette.primary.main,
                                            borderColor: theme.palette.primary.main,
                                            "&:hover": {
                                                backgroundColor: alpha("#ffffff", 0.1),
                                            },
                                            fontSize: "0.7rem",
                                            height: "fit-content", // Ajusta a altura do botão ao conteúdo
                                        }}
                                        onClick={handleOpen}
                                    >
                                        Adicionar Morada
                                    </Button>

                                )}
                                    <AddressModal open={open} handleClose={handleClose} user={user} />
                            </Box>
                        ) : (
                            // Quando não há moradas, exibe a mensagem
                            <Box
                                sx={{
                                    backgroundColor: "#0000000d",
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "10px",
                                    width: "30%",
                                    m: "auto",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                        color: "#9d9d9de8",
                                        textAlign: "center",
                                        mb: 2,
                                    }}
                                >
                                    Sem moradas registadas
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<span style={{ fontSize: "1rem", fontWeight: "bold" }}>+</span>}
                                    sx={{
                                        color: theme.palette.primary.main,
                                        borderColor: theme.palette.primary.main,
                                        "&:hover": {
                                            backgroundColor: alpha("#ffffff", 0.1),
                                        },
                                        fontSize: "0.7rem",
                                    }}
                                    onClick={handleOpen}
                                >
                                    Adicionar Morada
                                </Button>
                                <AddressModal open={open} handleClose={handleClose} user={user} />
                            </Box>
                        )
                    }

                </Box>
            </Paper>
        </>
    );
});

export default ProfileInformation;
