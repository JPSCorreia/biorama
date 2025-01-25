import { Paper, Typography, Avatar } from "@mui/material";

const StoreVendorCard = ({ store, vendor }) => {
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
                // src={store.???} //TODO: Mudar para o avatar do vendedor
                alt={`${vendor.first_name}'s Avatar`}
                sx={{
                    width: 80,
                    height: 80,
                    marginBottom: "15px",
                    border: "2px solid #fff", // Borda branca ao redor do avatar
                }}
            />
            {/* Store name*/}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {vendor.first_name} {vendor.last_name}
            </Typography>
            {/* Store Map TODO */}
                MAPA? talvez mais sentido na descrição
        </Paper>
    );
};

export default StoreVendorCard;
