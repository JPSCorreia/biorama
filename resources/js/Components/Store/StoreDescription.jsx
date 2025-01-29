import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

const StoreDescription = ({ store }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "top",
                alignItems: "center",
                width: "100%",
                // ml: 1,
                mt: 2,
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
                <ReactMarkdown>{store.description || "Esta loja ainda não tem uma descrição."}</ReactMarkdown>
            </Typography>
        </Box>
    );
};

export default StoreDescription;
