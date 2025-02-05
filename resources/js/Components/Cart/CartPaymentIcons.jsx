import visaIcon from "../../../images/payment_icons/visa.png";
import mbWayIcon from "../../../images/payment_icons/mb_way.png";
import mbWayDarkIcon from "../../../images/payment_icons/mb_way_dark.png";
import americanExpressIcon from "../../../images/payment_icons/american_express.png";
import multibancoIcon from "../../../images/payment_icons/multibanco.png";
import multibancoDarkIcon from "../../../images/payment_icons/multibanco_dark.png";
import paypalIcon from "../../../images/payment_icons/paypal.png";
import mastercardIcon from "../../../images/payment_icons/mastercard.png";
import mastercardDarkIcon from "../../../images/payment_icons/mastercard_dark.png";
import { useTheme, useMediaQuery } from "@mui/material";
import { Box } from "@mui/material";

const CartPaymentIcons = () => {
    const theme = useTheme();

    return (
        <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            gap={2}
            sx={{ mt: 1 }}
        >
            {[visaIcon, mastercardIcon, americanExpressIcon, mbWayIcon, multibancoIcon, paypalIcon].map((icon, index) => (
                <Box
                    key={index}
                    component="img"
                    sx={{
                        height: 35,
                        width: 55,
                        objectFit: "contain",
                    }}
                    alt="Método de Pagamento"
                    src={icon}
                />
            ))}
        </Box>
    );
};

export default CartPaymentIcons;
