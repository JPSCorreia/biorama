import { Box, Typography, Divider } from "@mui/material";
import { cartStore, homeAddressStore } from "../../Stores";
import { observer } from "mobx-react";
import { AddressCard, ReviewConfirmationList } from "../../Components/";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";

const ReviewStep = observer(({ selectedPayment }) => {

    const theme = useTheme();
        // useEffect(() => {
        //     homeAddressStore.fetchAddresses();
        // }, []);

    const address = homeAddressStore.primaryAddress;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                // gap: 1,
                justifyContent: "center",
                minWidth: 1200,
                height: "50vh",
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Morada de Envio</Typography>
                <AddressCard
                    // key={address.id}
                    address={address}
                    theme={theme}
                    checkout={true}
                    review={true}
                />
            </Box>
            <Divider />
            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Pagamento</Typography>
                {/* <ReviewConfirmationList /> */}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Encomenda</Typography>
                <ReviewConfirmationList />
            </Box>
        </Box>
    );
});

export default ReviewStep;
