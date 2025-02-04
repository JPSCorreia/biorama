import visaIcon from "../../../images/payment_icons/visa.png";
import mbWayIcon from "../../../images/payment_icons/mb_way.png";
import mbWayDarkIcon from "../../../images/payment_icons/mb_way_dark.png";
import americanExpressIcon from "../../../images/payment_icons/american_express.png";
import multibancoIcon from "../../../images/payment_icons/multibanco.png";
import multibancoDarkIcon from "../../../images/payment_icons/multibanco_dark.png";
import paypalIcon from "../../../images/payment_icons/paypal.png";
import mastercardIcon from "../../../images/payment_icons/mastercard.png";
import mastercardDarkIcon from "../../../images/payment_icons/mastercard_dark.png";

import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const CartPaymentIcons = () => {

    const theme = useTheme();

  return (
    <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    width="280px"
    sx= {{ mt: 2 }}
>
    <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        width="100%"
        justifyContent="space-between"
    >
        <Box
            component="img"
            sx={{
                height: 75,
                width: 75,
            }}
            alt="VISA Icon"
            src={visaIcon}
        />
        <Box
            component="img"
            sx={{
                height: 60,
                width: 60,
            }}
            alt="Mastercard Icon"
            src={theme.palette.mode === "dark" ? mastercardDarkIcon : mastercardIcon}
        />
        <Box
            component="img"
            sx={{
                height: 60,
                width: 60,
            }}
            alt="American Express Icon"
            src={americanExpressIcon}
        />
    </Box>
    <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
                                        width="100%"
        justifyContent="space-between"
    >
        <Box
            component="img"
            sx={{
                height: 75,
                width: 75,
                ml: "5px",
                mb: "6px"
            }}
            alt="MBWay Icon"
            src={theme.palette.mode === "dark" ? mbWayDarkIcon : mbWayIcon}
        />
        <Box
            component="img"
            sx={{
                height: 60,
                width: 60,
            }}
            alt="Multibanco Icon"
            src={theme.palette.mode === "dark" ? multibancoDarkIcon : multibancoIcon}
        />
        <Box
            component="img"
            sx={{
                height: 60,
                width: 60,
            }}
            alt="Paypal Icon"
            src={paypalIcon}
        />
    </Box>
</Box>
  )
}

export default CartPaymentIcons
