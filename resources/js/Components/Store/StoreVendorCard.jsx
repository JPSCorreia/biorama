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
    useTheme,
    useMediaQuery
} from "@mui/material";
import { formatDateToPortuguese } from "../../utils/utils";

const StoreVendorCard = observer(({ store, user, vendor, other }) => {

    const theme = useTheme();
    const smallerThanMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    let image_link = user?.image_profile;

    if (!user.image_profile?.includes("mock_images")) {
        image_link = image_link.replace("/loja", "");
      }

      // Garante que a URL é absoluta
      if (!user.image_profile?.startsWith("http")) {
        image_link = `${window.location.origin}/${image_link}`;
      }

    return (
        <Card
            sx={{
                minWidth: 250,
                width: smallerThanMediumScreen ? "100%" : "20%",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: 3,
                minHeight: 350,
                display: "flex",
                flexDirection: "column",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    height: 80,
                    width: "100%",
                    objectFit: "cover",
                    backgroundColor: theme.palette.primary.main,
                }}
            />
            {console.log(user)}

            {/* Avatar Circular no Centro */}
            <Box
                sx={{
                    position: "absolute",
                    top: 100, // Ajusta a posição do avatar
                    left: "50%",
                    transform: "translate(-50%, -75%)",
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
                <Avatar
                    src={image_link}
                    sx={{ width: 76, height: 76 }}
                />
            </Box>

            {/* Conteúdo do Card */}
            <CardContent sx={{ textAlign: "center", pt: 6, pb: 0.75 }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                    {vendor?.first_name + " " + vendor?.last_name ||
                        "Vendedor sem Nome"}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 0.5 }}>
                    Vendedor
                </Typography>
                <Rating
                    value={Number(other?.vendor_rating) || 0}
                    precision={0.5}
                    readOnly
                    sx={{ fontSize: 18 }}
                />
                <Typography
                    variant="body2"
                    color="text.secondary">{other?.review_count} avaliações</Typography>
            </CardContent>
            <Divider
                sx={{
                    height: "1px",
                    background:
                        "linear-gradient(to right, transparent, #000, transparent)",
                    border: "none",
                    // mb: 1,
                }}
            />

            {/* Informações */}
            <CardContent sx={{ pb: "0.25rem !important" }}>
                <Box sx={{ mb: 1 }}>
                        <Typography fontWeight="bold">Membro desde:</Typography>
                        <Typography
                            sx={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {formatDateToPortuguese(vendor?.created_at)}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography fontWeight="bold">Email:</Typography>
                        <Typography
                            sx={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {vendor?.email}
                        </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Typography fontWeight="bold">Telefone:</Typography>
                        <Typography
                            sx={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "pre-wrap",
                            }}
                        >
                            {vendor?.phone}
                        </Typography>
                    </Box>
            </CardContent>
        </Card>
    );
});

export default StoreVendorCard;
