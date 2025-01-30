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
