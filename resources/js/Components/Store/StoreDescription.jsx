import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";

const StoreDescription = ({ store }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "top",
                width: "100%",
                // ml: 1,
                mt: 4,
                mr: 1,
                borderRadius: "10px",
            }}
        >
            <Typography
                variant="h4"
                sx={{ marginBottom: 2, fontWeight: "bold", textAlign: "left", mt: 4, }}
            >
                Quem somos
            </Typography>
            <Box
                variant="body2"
                color="text.secondary"
            >
                <ReactMarkdown>
                    {store.description ||
                        "Esta loja ainda não tem uma descrição."}
                </ReactMarkdown>
            </Box>
        </Box>
    );
};

export default StoreDescription;
