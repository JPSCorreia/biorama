import { Paper, Typography } from "@mui/material";

const StoreDescription = ({ store }) => {
    return (
        <Paper
            elevation={4}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "top",
                alignItems: "center",
                width: "40%",
                ml: 1,
                mr: 1,
                padding: 3,
                pt: 2,
                borderRadius: "10px",
            }}
        >
            <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
                Descrição
            </Typography>
            <Typography variant="body2" color="textSecondary">
                {store.description || "Esta loja ainda não tem uma descrição."}
            </Typography>
        </Paper>
    );
};

export default StoreDescription;
