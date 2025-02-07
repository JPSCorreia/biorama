import { Box, Button, Radio, Typography, CircularProgress } from "@mui/material";
import { homeAddressStore } from "../../Stores";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { useTheme } from "@mui/material/styles";

const AddressStep = observer(({ selectedAddress, setSelectedAddress }) => {
    const theme = useTheme();

    // useEffect(() => {
    //     homeAddressStore.fetchAddresses();
    // }, []);

    if (!homeAddressStore.addresses || homeAddressStore.addresses.length === 0) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 1200 }}>
            {homeAddressStore.addresses.map((address, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                    <Radio checked={selectedAddress === address} onChange={() => setSelectedAddress(address)} />
                    <Typography>{address.street_address}</Typography>
                </Box>
            ))}
            <Button variant="outlined" onClick={() => setSelectedAddress("Morada Temporária")}>
                Usar uma morada temporária
            </Button>
        </Box>
    );
});

export default AddressStep;
