import { useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { StoreReviewForm, StoreReviewList } from "../";
import { usePage } from "@inertiajs/react";
import { authStore } from "../../Stores";

const StoreCommentContainer = () => {
    const theme = useTheme();
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mt: 4,
                    mb: 4,
                }}
            >
                <Box
                    sx={{
                        width: "50%",
                    }}
                >
                    <StoreReviewList reviews={usePage().props.store.reviews} />
                </Box>
                <Box
                    sx={{
                        width: "50%",
                    }}
                >
                    {authStore.isAuthenticated && <StoreReviewForm />}
                </Box>
            </Box>
        </>
    );
};

export default StoreCommentContainer;
