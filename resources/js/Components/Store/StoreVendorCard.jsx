import { Typography, Box, Avatar } from "@mui/material";

const StoreVendorCard = ({ store, vendor, user }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "30%",
                mr: 1,
                padding: 3,
                pt: 2,
                borderRadius: "10px",
                flexWrap: "wrap",
                // border: "1px solid #e0e0e0",
            }}
        >
            <Typography
                variant="h6"
                sx={{ fontWeight: "bold", marginBottom: 1 }}
            >
                Vendedor
            </Typography>
            {/* Vendor Avatar */}
            <Avatar
                src={user.image_profile}
                alt={`${vendor.first_name}'s Avatar`}
                sx={{
                    width: 80,
                    height: 80,
                    marginBottom: 1,
                    marginTop: 1,
                    alignSelf: "center",
                    border: "2px solid #fff", // Borda branca ao redor do avatar
                }}
            />
            <Box
                sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
                {/* Store name*/}
                <Typography
                    sx={{ fontWeight: "bold", alignSelf: "center", mb: 1 }}
                >
                    {vendor.first_name} {vendor.last_name}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
                    <Box sx={{ display: "flex", flexDirection: "row", mb: 1 }}>
                        <Typography sx={{ fontWeight: "bold" }}>
                            Rating:
                        </Typography>
                        <Typography sx={{ ml: 1 }}>
                            {store.rating} / 5
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", mb: 1 }}>
                        <Typography sx={{ fontWeight: "bold" }}>
                            Telefone:
                        </Typography>
                        <Typography sx={{ ml: 1 }}>{vendor.phone}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            mb: 1,
                        }}
                    >
                        <Typography sx={{ fontWeight: "bold" }}>
                            Email:
                        </Typography>
                                        <Typography
                                            sx={{
                                                ml: 1,
                                                width: "100%",
                                                wordWrap: "break-word",
                                                overflowWrap: "break-word",
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                            {vendor.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default StoreVendorCard;
