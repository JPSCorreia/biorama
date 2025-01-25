import { Paper, Typography } from "@mui/material";

const StoreDescription = ({ store }) => {
    return (
        <Paper
            elevation={4}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "top",
                width: "60%",
                ml: 1,
                padding: 2,
                borderRadius: "10px",
            }}
        >
            <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
                Descrição da Loja
            </Typography>
            <Typography variant="body2" color="textSecondary">
                {store.description || "Esta loja ainda não tem uma descrição."}
            </Typography>
        </Paper>
    );
};

export default StoreDescription;
