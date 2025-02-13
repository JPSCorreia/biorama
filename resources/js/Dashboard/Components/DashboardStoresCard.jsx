import { observer } from "mobx-react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Typography,
    Avatar,
    Rating,
    useMediaQuery,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { fixImagePath } from "../../utils/utils.js";
import { shopStore } from "@/Stores/index.js";
import ReactMarkdown from "react-markdown";
import { useTheme } from "@mui/material/styles";

/**
 * Component: DashboardStoresCard
 * Description: Displays a card with store details such as name, description, location, and rating.
 * Allows navigation to the store's detail page.
 */
const DashboardStoresCard = observer(({ store, user }) => {
    // Retrieves the first gallery image for background and user's profile image for avatar
    const backgroundImage = fixImagePath(store?.galleries[0]?.image_link);
    const profileImage = fixImagePath(user?.image_profile);

    // Limits the store description to 150 characters and appends "..." if truncated
    const truncatedDescription =
        store?.description?.length > 150
            ? `${store.description.slice(0, 150)}...`
            : store?.description || "Sem Descrição";

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

    return (
        <Card
            sx={{
                maxWidth: 300,
                width: "100%",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: 3,
                minHeight: 592,
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            {/* Background image of the store */}
            <CardMedia
                component="img"
                sx={{
                    height: 120,
                    width: "100%",
                    objectFit: "cover",
                }}
                image={backgroundImage}
                alt="Sem imagem"
            />

            {/* Circular avatar positioned at the center of the card */}
            <Box
                sx={{
                    position: "absolute",
                    top: 70,
                    left: "50%",
                    transform: "translate(-50%, 0%)",
                    zIndex: 2,
                    borderRadius: "50%",
                    border: "4px solid white",
                    width: 90,
                    height: 90,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                }}
            >
                <Avatar src={profileImage} sx={{ width: 76, height: 76 }} />
            </Box>

            {/* Store name and city */}
            <CardContent sx={{ textAlign: "center", pt: 6 }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                    {store?.name || "Loja sem Nome"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {store?.addresses?.[0]?.city || "Sem Cidade"}
                </Typography>
            </CardContent>

            {/* Divider between content sections */}
            <Divider
                sx={{
                    height: "1px",
                    background:
                        "linear-gradient(to right, transparent, #000, transparent)",
                    border: "none",
                    mb: 2,
                }}
            />

            {/* Store information section */}
            <CardContent sx={{ display: "flex", flexDirection: "column",  justifyContent: "flex-end", minHeight: "335px"}}>
                <Box>
                    {/* Descrição */}
                    <Box sx={{ marginBottom: "2rem", minHeight: "200px" }}>
                        <Typography fontWeight="bold">Descrição:</Typography>
                        <ReactMarkdown>{truncatedDescription}</ReactMarkdown>
                    </Box>

                    {/* Rating */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            px: 2
                        }}
                    >
                        <Box>
                            <Typography fontWeight="bold">Rating:</Typography>
                            <Rating
                                value={store.reviews.reduce((sum, review) => sum + review.rating, 0) / (store.reviews.length || 1)}
                                precision={0.5}
                                readOnly
                            />
                        </Box>

                        {/* Button to navigate to store details */}
                        <Box
                            sx={{
                                textAlign: "right",
                                mt: "auto",
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                    shopStore.navigateToStore(store.id)
                                }
                                sx={{
                                    borderRadius: "50%",
                                    width: 50,
                                    height: 50,
                                    minWidth: 0,
                                    padding: 0,
                                }}
                            >
                                <RemoveRedEyeIcon />
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
});

export default DashboardStoresCard;
