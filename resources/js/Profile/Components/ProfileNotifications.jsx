import {List, ListItem, ListItemText, Button, Typography, Paper, Box, useMediaQuery, IconButton} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useNotifications from "../../hooks/useNotifications.jsx";
import axios from "axios";
import {CheckCircle, Delete} from "@mui/icons-material";

const ProfileNotifications = () => {
    const theme = useTheme();
    const smallerThanLg = useMediaQuery(theme.breakpoints.down("lg"));
    const { notifications, setNotifications } = useNotifications();

    const markAsRead = (id) => {
        axios.post(`/notifications/${id}/read`)
            .then(() => {
                setNotifications(notifications.map(n =>
                    n.id === id ? { ...n, read_at: new Date().toISOString() } : n
                ));
            })
            .catch(error => console.error("Erro ao marcar como lida", error));
    };
    const deleteNotification = (id) => {
        axios.delete(`/notifications/${id}`)
            .then(() => {
                setNotifications(notifications.filter(n => n.id !== id));
            })
            .catch(error => console.error("Erro ao apagar a notificação", error));
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
            <Paper
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
                    {notifications.map(notification => (
                        <ListItem key={notification.id} sx={{ background: notification.read_at ? 'white' : '#f0f0f0' }}>
                            <ListItemText
                                primary={notification.data.message}
                                secondary={new Date(notification.created_at).toLocaleString()}
                            />
                            {/* Botão para marcar como lida */}
                            {!notification.read_at && (
                                <IconButton onClick={() => markAsRead(notification.id)} sx={{ color: 'green' }}>
                                    <CheckCircle />
                                </IconButton>
                            )}
                            {/* Botão para apagar a notificação */}
                            <IconButton onClick={() => deleteNotification(notification.id)} sx={{ color: 'red' }}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>

            </Paper>
        </Box>
    );
};

export default ProfileNotifications;
