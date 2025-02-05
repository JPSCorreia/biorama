import { observer } from "mobx-react";
import { cartStore, homeAddressStore } from "../../Stores";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
    Typography,
    Box,
    Tooltip,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { CartProductCard } from "..";
import { useState, useEffect, Fragment } from "react";

const CartList = observer(() => {
    const [shippingCosts, setShippingCosts] = useState({});

    const theme = useTheme();
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));

    // Calcula o custo de envio baseado na distância
    function calculateShippingCost(distanceKm) {
        const baseCost = 4.0; // Custo fixo até 5 km
        const costPerKm = 0.15; // Custo extra por km após 5 km
        const baseDistance = 5; // Distância incluída no custo base

        let finalCost;

        if (distanceKm <= baseDistance) {
            finalCost = baseCost;
        } else {
            finalCost = baseCost + (distanceKm - baseDistance) * costPerKm;
        }

        return finalCost;
    }

    // Obtém a distância correta entre a loja e o endereço do utilizador
    async function getDistanceFromOSRM(lat1, lon1, lat2, lon2) {
        const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const distanceMeters = data.routes[0].distance; // Distância em METROS
                const distanceKm = distanceMeters / 1000; // 🔹 Converter para KM
                console.log(
                    `✅ Distância correta: ${distanceMeters}m (${distanceKm.toFixed(2)} km)`,
                );
                return distanceKm;
            } else {
                console.error("⚠️ Erro ao obter rota do OSRM");
                return null;
            }
        } catch (error) {
            console.error("⚠️ Erro na API OSRM:", error);
            return null;
        }
    }

    // Calcula os portes para cada loja no carrinho
    useEffect(() => {
        async function calculateShipping() {
            let costs = {};

            for (const [storeId] of Object.entries(cartStore.cart)) {
                if (
                    cartStore.cart[storeId][0].store.latitude &&
                    cartStore.cart[storeId][0].store.longitude &&
                    homeAddressStore?.primaryAddress?.latitude &&
                    homeAddressStore?.primaryAddress?.longitude
                ) {
                    const distance = await getDistanceFromOSRM(
                        cartStore.cart[storeId][0].store.latitude,
                        cartStore.cart[storeId][0].store.longitude,
                        homeAddressStore?.primaryAddress?.latitude,
                        homeAddressStore?.primaryAddress?.longitude,
                    );

                    if (distance !== null) {
                        costs[storeId] = calculateShippingCost(distance);
                    }
                }
            }

            setShippingCosts(costs);
        }

        calculateShipping();
    }, [cartStore.cart, homeAddressStore?.primaryAddress]);

    return (
        <Box sx={{ display: "flex", width: "100%", justifyContent: "start" }}>
            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    backgroundColor: "background.paper",
                    justifySelf: "start",
                    justifyContent: "start",
                    flexWrap: "wrap",
                    minWidth: smallerThanLarge ? "100%" : "800px",
                    gap: 3,
                }}
            >
                {Object.entries(cartStore.cart).map(
                    ([storeId, products], index, arr) => {
                        const store = products[0].store;
                        const shippingCost = shippingCosts[storeId] || "N/A";

                        return (
                            <Fragment key={storeId}>
                                <Box
                                    sx={{
                                        p: 2,
                                        pt: 0,
                                        pb: 0,
                                        gap: 3,
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        alignItems="baseline"
                                        sx={{ flexDirection: "row" }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 14,
                                            }}
                                        >
                                            Loja:
                                        </Typography>
                                        <Typography
                                            color="terciary"
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 20,
                                                ml: 1,
                                            }}
                                        >
                                            {store.name}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 3,
                                            flexWrap: "wrap",
                                            justifyContent: smallerThanLarge
                                                ? "center"
                                                : "start",
                                        }}
                                    >
                                        {products.map((product) => (
                                            <CartProductCard
                                                key={product.id}
                                                product={product}
                                                storeId={storeId}
                                            />
                                        ))}
                                    </Box>
                                    <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: smallerThanMedium
                                                    ? "column"
                                                    : "row",

                                                alignItems: smallerThanMedium
                                                    ? "start"
                                                    : "center",
                                                justifyContent: "space-around",
                                                width: "100%",
                                            }}
                                        >
                                            {/* Subtotal */}
                                            <Box
                                                display="flex"
                                                alignItems="baseline"
                                                sx={{
                                                    flexDirection: "row",
                                                    minWidth: "150px",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    Subtotal:
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                        fontSize: 20,
                                                        ml: 1,
                                                    }}
                                                >
                                                    €
                                                    {Number(
                                                        cartStore.storeTotals[
                                                            storeId
                                                        ],
                                                    ).toFixed(2)}
                                                </Typography>
                                            </Box>

                                            {/* Portes de Envio */}
                                            <Box
                                                display="flex"
                                                alignItems="baseline"
                                                sx={{ flexDirection: "row" }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    Custos de envio:
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                        fontSize: 20,
                                                        ml: 1,
                                                    }}
                                                >
                                                    €
                                                    {shippingCost !== "N/A"
                                                        ? shippingCost.toFixed(
                                                              2,
                                                          )
                                                        : "N/A"}
                                                </Typography>
                                            </Box>

                                            {/* Total */}
                                            <Box
                                                display="flex"
                                                alignItems="baseline"
                                                sx={{ flexDirection: "row" }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    Total:
                                                </Typography>
                                                <Typography
                                                    color="terciary"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        fontSize: 20,
                                                        ml: 1,
                                                    }}
                                                >
                                                    €
                                                    {(
                                                        Number(
                                                            cartStore
                                                                .storeTotals[
                                                                storeId
                                                            ],
                                                        ) +
                                                        (shippingCost !== "N/A"
                                                            ? Number(
                                                                  shippingCost,
                                                              )
                                                            : 0)
                                                    ).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Tooltip title="Eliminar produtos desta loja">
                                            <IconButton
                                                variant="outlined"
                                                sx={{ mr: 2 }}
                                                color="delete"
                                                onClick={() =>
                                                    cartStore.clearStore(
                                                        storeId,
                                                    )
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {/* Botão para eliminar produtos */}
                                        {/* <Tooltip title="Eliminar produtos desta loja">
                                            <IconButton
                                                variant="outlined"
                                                sx={{ mr: 2 }}
                                                color="delete"
                                                onClick={() => cartStore.clearStore(storeId)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip> */}
                                    </Box>
                                </Box>

                                {index !== arr.length - 1 && (
                                    <Divider variant="middle" />
                                )}
                            </Fragment>
                        );
                    },
                )}
            </Box>
        </Box>
    );
});

export default CartList;
