import { Paper, Typography, Box, Avatar } from "@mui/material";

const StoreVendorCard = ({ store, vendor, user }) => {
    return (
        <Paper
            elevation={4}
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "40%",
                mr: 1,
                padding: 2,
                borderRadius: "10px",
            }}
        >
            {/* Vendor Avatar */}
            <Avatar
                src={user.image_profile}
                alt={`${vendor.first_name}'s Avatar`}
                sx={{
                    width: 80,
                    height: 80,
                    marginBottom: "15px",
                    border: "2px solid #fff", // Borda branca ao redor do avatar
                }}
            />
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                {/* Store name*/}
                <Typography variant="h6" sx={{ fontWeight: "bold", alignSelf: "center" }}>
                    {vendor.first_name} {vendor.last_name}
                </Typography>
                <Typography >Rating: 4.8</Typography>
                <Typography>
                    Numero de vendas: 150
                </Typography>
                <Typography>etc</Typography>
            </Box>
        </Paper>
    );
};

export default StoreVendorCard;
