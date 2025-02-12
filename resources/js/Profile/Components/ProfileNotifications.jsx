import {
    List,
    ListItem,
    ListItemText,
    Tooltip,
    Typography,
    Paper,
    Box,
    useMediaQuery,
    IconButton,
    CircularProgress
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useNotifications from "../../hooks/useNotifications.jsx";
import axios from "axios";
import { CheckCircle, Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";

const ProfileNotifications = () => {

    const theme = useTheme();
    const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));
    const { notifications, setNotifications } = useNotifications();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       setTimeout(() => {
        setLoading(false);
       }, 250)
    }, []);

    const markAsRead = (id) => {
        axios
            .post(`/notifications/${id}/read`)
            .then(() => {
                setNotifications(
                    notifications.map((n) =>
                        n.id === id
                            ? { ...n, read_at: new Date().toISOString() }
                            : n,
                    ),
                );
            })
            .catch((error) => console.error("Erro ao marcar como lida", error));
    };
    const deleteNotification = (id) => {
        axios
            .delete(`/notifications/${id}`)
            .then(() => {
                setNotifications(notifications.filter((n) => n.id !== id));
            })
            .catch((error) =>
                console.error("Erro ao apagar a notificação", error),
            );
    };
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
                ml: smallerThanLg ? 0 : 4,
                maxWidth: smallerThanLg ? "100%" : "75%",
                flexGrow: 1,
            }}
        >
            <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, width: "100%" }}
            >
                Notificações
            </Typography>
            { loading?                 <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    minHeight: "500px",
                                }}
                            >
                                <CircularProgress />
                            </Box> :             <Paper
                elevation={4}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "start",
                    p: 2,
                    borderRadius: "8px",
                }}
            >
                {notifications.length === 0 && (
                    <Typography variant="body1">
                        Não tem nenhuma notificação
                    </Typography>
                )}
                <List>
                    {notifications.map((notification) => (
                        <ListItem key={notification.id}>
                            <Paper
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    p: 2,
                                    background: notification.read_at
                                        ? theme.palette.background.default
                                        : "#f0f0f0",
                                    alignItems: "center",
                                }}
                                elevation={4}
                            >
                                <ListItemText
                                    primary={notification.data.message}
                                    secondary={new Date(
                                        notification.created_at,
                                    ).toLocaleString()}
                                />
                                {/* Botão para marcar como lida */}
                                {!notification.read_at && (
                                    <Tooltip title="Apagar notificação">
                                        <IconButton
                                            onClick={() =>
                                                markAsRead(notification.id)
                                            }
                                            sx={{
                                                color: "green",
                                                height: 48,
                                                width: 48,
                                            }}
                                        >
                                            <CheckCircle />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {/* Botão para apagar a notificação */}
                                <Tooltip title="Apagar notificação">
                                    <IconButton
                                        onClick={() =>
                                            deleteNotification(notification.id)
                                        }
                                        sx={{
                                            color: "red",
                                            height: 48,
                                            width: 48,
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                        </ListItem>
                    ))}
                </List>
            </Paper> }

        </Box>
    );
};

export default ProfileNotifications;
