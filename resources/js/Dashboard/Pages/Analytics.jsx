import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    Divider,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LineChart,
    Line,
    Legend,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    Label,
} from "recharts";

const Analytics = () => {
    // State management
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get media queries
    const theme = useTheme();
    const colors = [
        theme.palette.charts.main,
        theme.palette.charts.secondary,
        theme.palette.charts.terciary,
    ];
    const smallerThanSmall = useMediaQuery(theme.breakpoints.down("sm")); // Mobile
    const smallerThanLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const smallerThanMedium = useMediaQuery(theme.breakpoints.down("md"));

    // Function to fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const response = await axios.get("/dashboard/data");
            setDashboardData(response.data);
            setLoading(false);
        } catch (err) {
            setError("Erro ao carregar os dados.");
            setLoading(false);
        }
    };

    // Fetch dashboard data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Function to fill missing months of revenue
    const fillMissingMonthsRevenue = (data) => {
        const months = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            total_revenue: 0,
        }));
        data.forEach((item) => {
            months[item.month - 1].total_revenue = item.total_revenue;
        });
        return months;
    };

    // Function to fill missing months of orders
    const fillMissingMonthsOrders = (data) => {
        const months = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            total_orders: 0,
        }));
        data.forEach((item) => {
            months[item.month - 1].total_orders = item.total_orders;
        });
        return months;
    };

    // Graph data preparation
    const prepareAnnualData = (currentData = [], lastYearData = [], type) => {
        const months = [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
        ];

        const filledCurrentYear =
            type === "revenue"
                ? fillMissingMonthsRevenue(currentData)
                : fillMissingMonthsOrders(currentData);
        const filledLastYear =
            type === "revenue"
                ? fillMissingMonthsRevenue(lastYearData)
                : fillMissingMonthsOrders(lastYearData);

        return filledCurrentYear.map((item, index) => ({
            month: months[index],
            currentYear:
                type === "revenue" ? item.total_revenue : item.total_orders,
            previousYear:
                type === "revenue"
                    ? filledLastYear[index].total_revenue
                    : filledLastYear[index].total_orders,
        }));
    };
    const annualOrdersData = prepareAnnualData(
        dashboardData?.annual_orders_current_year,
        dashboardData?.annual_orders_last_year,
        "orders",
    );
    const annualRevenueData = prepareAnnualData(
        dashboardData?.monthly_revenue_current_year,
        dashboardData?.monthly_revenue_last_year,
        "revenue",
    );
    const monthlyRevenueData = [
        {
            month: "Mês Anterior",
            revenue: dashboardData?.revenue_last_month || 0,
        },
        {
            month: "Este Mês",
            revenue: dashboardData?.revenue_current_month || 0,
        },
    ];

    const pieChartData = dashboardData?.stores.map((store) => ({
        name: store.name,
        treated: store.treated_percentage,
    }));

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                mt: 4,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Header Section */}
            <Paper
                elevation={4}
                sx={{
                    width: "96%",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    padding: 2,
                    borderRadius: "8px",
                }}
            >
                <Typography variant="h4" fontWeight="bold">
                    Painel de Estatísticas
                </Typography>
            </Paper>

            {/* Cards Section */}
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    my: 4,
                    width: "94%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            minHeight: "800px",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {" "}
                        {/* Info Cards */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                mb: 3,
                                gap: 3,
                                justifyContent: "space-between",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexGrow: 1,
                                    gap: 3,
                                    flexDirection: smallerThanSmall
                                        ? "column"
                                        : "row",
                                }}
                            >
                                {/* Card 1 - Revenue Today */}
                                <Card
                                    sx={{
                                        height: "115px",
                                        minWidth: "220px",
                                        width: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        position: "relative",
                                        flexGrow: 1,
                                        gap: 3,
                                        p: 2,
                                        pt: 1.5,
                                    }}
                                >
                                    <CardContent sx={{ padding: "0px" }}>
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                color: "text.secondary",
                                            }}
                                        >
                                            Receita Hoje
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 24,
                                            }}
                                        >
                                            €{dashboardData?.revenue_today}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                mt: 0.35,
                                                alignItems: "center",
                                                // justifyContent: "center",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: "bold",
                                                    color:
                                                        dashboardData?.todayDiffPercentage >=
                                                        0
                                                            ? "green"
                                                            : "red",
                                                }}
                                            >
                                                {dashboardData?.today_diff_percentage ==
                                                0
                                                    ? "-0"
                                                    : dashboardData?.today_diff_percentage}
                                                %
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                que ontem
                                            </Typography>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 16,
                                                    right: 16,
                                                    backgroundColor:
                                                        theme.palette.dashboard
                                                            .iconBackground,
                                                    padding: 1,
                                                    borderRadius: "8px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <AccountBalanceWalletIcon
                                                    sx={{
                                                        fontSize: 30,
                                                        color: theme.palette
                                                            .dashboard.icon,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Card 2 - Revenue Current Month */}
                                <Card
                                    sx={{
                                        height: "115px",
                                        minWidth: "220px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        position: "relative",
                                        flexGrow: 1,
                                        width: "100%",
                                        gap: 3,
                                        p: 2,
                                        pt: 1.5,
                                    }}
                                >
                                    <CardContent sx={{ padding: "0px" }}>
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                color: "text.secondary",
                                            }}
                                        >
                                            Receita Este Mês
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 24,
                                            }}
                                        >
                                            €
                                            {
                                                dashboardData?.revenue_current_month
                                            }
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                mt: 0.35,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: "bold",
                                                    color:
                                                        dashboardData?.month_diff_percentage >=
                                                        0
                                                            ? "green"
                                                            : "red",
                                                }}
                                            >
                                                {
                                                    dashboardData?.month_diff_percentage
                                                }
                                                %
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                que o mês passado
                                            </Typography>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 16,
                                                    right: 16,
                                                    backgroundColor:
                                                        theme.palette.dashboard
                                                            .iconBackground,
                                                    padding: 1,
                                                    borderRadius: "8px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <PointOfSaleIcon
                                                    sx={{
                                                        fontSize: 30,
                                                        color: theme.palette
                                                            .dashboard.icon,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexGrow: 1,
                                    gap: 3,
                                    flexDirection: smallerThanSmall
                                        ? "column"
                                        : "row",
                                }}
                            >
                                {/* Card 3 - Revenue Current Year */}
                                <Card
                                    sx={{
                                        height: "115px",
                                        minWidth: "220px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        position: "relative",
                                        flexGrow: 1,
                                        width: "100%",
                                        gap: 3,
                                        p: 2,
                                        pt: 1.5,
                                    }}
                                >
                                    <CardContent sx={{ padding: "0px" }}>
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                color: "text.secondary",
                                            }}
                                        >
                                            Receita Este Ano
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 24,
                                            }}
                                        >
                                            €
                                            {dashboardData?.revenue_current_year}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                mt: 0.35,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: "bold",
                                                    color:
                                                        dashboardData?.year_diff_percentage >=
                                                        0
                                                            ? "green"
                                                            : "red",
                                                }}
                                            >
                                                {
                                                    dashboardData?.year_diff_percentage
                                                }
                                                %
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                que o ano passado
                                            </Typography>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 16,
                                                    right: 16,
                                                    backgroundColor:
                                                        theme.palette.dashboard
                                                            .iconBackground,
                                                    padding: 1,
                                                    borderRadius: "8px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <AccountBalanceIcon
                                                    sx={{
                                                        fontSize: 30,
                                                        color: theme.palette
                                                            .dashboard.icon,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {/* Card 4 - Orders Current Year */}
                                <Card
                                    sx={{
                                        height: "115px",
                                        minWidth: "220px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        position: "relative",
                                        flexGrow: 1,
                                        width: "100%",
                                        gap: 3,
                                        p: 2,
                                        pt: 1.5,
                                    }}
                                >
                                    <CardContent sx={{ padding: "0px" }}>
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                color: "text.secondary",
                                            }}
                                        >
                                            Encomendas Este Ano
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                fontSize: 24,
                                            }}
                                        >
                                            {
                                                dashboardData?.total_orders_current_year
                                            }
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                mt: 0.35,
                                                alignItems: "center",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: "bold",
                                                    color: "red",
                                                }}
                                            >
                                                {
                                                    dashboardData?.cancelled_percentage
                                                }
                                                %
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: 13,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                de encomendas canceladas
                                            </Typography>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 16,
                                                    right: 16,
                                                    backgroundColor:
                                                        theme.palette.dashboard
                                                            .iconBackground,
                                                    padding: 1,
                                                    borderRadius: "8px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <ShoppingCartIcon
                                                    sx={{
                                                        fontSize: 30,
                                                        color: theme.palette
                                                            .dashboard.icon,
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                        {/* Graph section */}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                            {/* Graph 1 - Monthly Revenue */}
                            <Card
                                sx={{
                                    flex: 1,
                                    minWidth: smallerThanSmall
                                        ? "100%"
                                        : smallerThanLarge
                                          ? "350px"
                                          : "30%",
                                    borderRadius: "8px",
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Receita Mensal
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart
                                        data={monthlyRevenueData}
                                        margin={{ left: 5, right: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />

                                        {/* Eixo X com label */}
                                        <XAxis dataKey="month">
                                            <Label
                                                value="Mês"
                                                offset={-10}
                                                position="insideBottom"
                                            />
                                        </XAxis>

                                        {/* Eixo Y com formatação e label */}
                                        <YAxis
                                            tickFormatter={(value) =>
                                                `€${value}`
                                            }
                                        >
                                            <Label
                                                value="Receita (€)"
                                                angle={-90}
                                                position="insideLeft"
                                                style={{ textAnchor: "middle" }}
                                            />
                                        </YAxis>

                                        {/* Tooltip melhorada */}
                                        <Tooltip
                                            formatter={(value) => `€${value}`}
                                        />

                                        {/* Legenda alinhada à esquerda */}
                                        <Legend
                                            align="left"
                                            wrapperStyle={{
                                                paddingLeft: "5px",
                                                paddingTop: "10px",
                                            }}
                                        />

                                        {/* Barras com espaçamento melhorado */}
                                        <Bar
                                            dataKey="revenue"
                                            name="Receita"
                                            fill={theme.palette.charts.main}
                                            barSize={50}
                                            barGap={5} // Dá um pequeno espaçamento entre as barras
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>

                            {/* Graph 2 - Annual Orders */}
                            <Card
                                sx={{
                                    flex: 1,
                                    minWidth: smallerThanSmall
                                        ? "100%"
                                        : smallerThanLarge
                                          ? "350px"
                                          : "30%",
                                    borderRadius: "8px",
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Encomendas Anuais
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart
                                        data={annualOrdersData}
                                        margin={{ left: 5, right: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />

                                        {/* Eixo X com label */}
                                        <XAxis dataKey="month"></XAxis>

                                        {/* Eixo Y com formatação e label */}
                                        <YAxis
                                            tickFormatter={(value) =>
                                                `${value}`
                                            }
                                        >
                                            <Label
                                                value="Encomendas"
                                                angle={-90}
                                                position="insideLeft"
                                                style={{ textAnchor: "middle" }}
                                            />
                                        </YAxis>

                                        {/* Tooltip melhorada */}
                                        <Tooltip
                                            formatter={(value) =>
                                                `${value} Encomendas`
                                            }
                                        />

                                        {/* Legenda alinhada à esquerda */}
                                        <Legend
                                            align="left"
                                            wrapperStyle={{
                                                paddingLeft: "5px",
                                                paddingTop: "10px",
                                            }}
                                        />

                                        {/* Linhas com estilo consistente */}
                                        <Line
                                            type="monotone"
                                            dataKey="currentYear"
                                            stroke="#4caf50"
                                            name="Este Ano"
                                            strokeWidth={2}
                                            dot={{ r: 4 }} // Adiciona pequenos pontos nas interseções para destaque
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="previousYear"
                                            stroke="#FF8042"
                                            name="Ano Passado"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>

                            {/* Graph 3 - Annual Revenue */}
                            <Card
                                sx={{
                                    flex: 1,
                                    minWidth: smallerThanSmall
                                        ? "100%"
                                        : smallerThanLarge
                                          ? "350px"
                                          : "30%",
                                    borderRadius: "8px",
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Receita Anual
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart
                                        data={annualRevenueData}
                                        margin={{ left: 5, right: 10 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis dataKey="month"></XAxis>

                                        <YAxis
                                            tickFormatter={(value) =>
                                                `€${value}`
                                            }
                                        ></YAxis>

                                        <Tooltip
                                            formatter={(value) => `€${value}`}
                                        />

                                        <Legend
                                            align="left"
                                            wrapperStyle={{
                                                paddingLeft: "5px",
                                                paddingTop: "10px",
                                            }}
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="currentYear"
                                            stroke="#4caf50"
                                            name="Este Ano"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="previousYear"
                                            stroke="#FF8042"
                                            name="Ano Passado"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>

                            {/* Table 1 - Store Analytics */}
                            <Card
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    minWidth: smallerThanMedium
                                        ? "100%"
                                        : "350px",
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Faturamento e Encomendas por Loja
                                </Typography>
                                <TableContainer component={Box}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Loja</TableCell>
                                                <TableCell align="right">
                                                    Faturamento
                                                </TableCell>
                                                <TableCell align="right">
                                                    Encomendas
                                                </TableCell>
                                                {smallerThanSmall ? null : (
                                                    <TableCell align="right">
                                                        % Tratadas
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData?.stores.map(
                                                (store, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {store.name}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            €
                                                            {store.total_revenue.toFixed(
                                                                2,
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            {store.total_orders}{" "}
                                                            /{" "}
                                                            {
                                                                dashboardData?.total_orders
                                                            }
                                                        </TableCell>
                                                        {smallerThanSmall ? null : (
                                                            <TableCell align="right">
                                                                <Box
                                                                    sx={{
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        gap: 1,
                                                                    }}
                                                                >
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={
                                                                            store.handling_index
                                                                        }
                                                                        sx={{
                                                                            width: "100%",
                                                                            height: 10,
                                                                            borderRadius: 5,
                                                                            backgroundColor:
                                                                                "#e0e0e0", // Fundo da barra
                                                                            "& .MuiLinearProgress-bar":
                                                                                {
                                                                                    backgroundColor:
                                                                                        store.handling_index >=
                                                                                        90
                                                                                            ? "#4caf50"
                                                                                            : store.handling_index >=
                                                                                                55
                                                                                              ? "#FFBB28"
                                                                                              : "#FF8042",
                                                                                },
                                                                        }}
                                                                    />
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 12,
                                                                            minWidth: 35,
                                                                        }}
                                                                    >
                                                                        {Math.round(
                                                                            store.handling_index,
                                                                        )}
                                                                        %
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                ),
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>

                            {/* Circular Graph - Orders Treated */}
                            <Card
                                sx={{
                                    flex: 1,
                                    p: 2,
                                    minWidth: smallerThanMedium
                                        ? "100%"
                                        : "350px",
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Percentagem de Encomendas
                                </Typography>
                                <ResponsiveContainer width="100%" height={230}>
                                    <PieChart margin={{ left: -10, right: 20 }}>
                                        <Pie
                                            data={pieChartData}
                                            dataKey="treated"
                                            nameKey="name"
                                            outerRadius={75}
                                            label={({ name, percent }) =>
                                                `${name}: ${Math.round(percent * 100)}%`
                                            }
                                            labelLine={false}
                                            labelPosition="outside"
                                            style={{ fontSize: "16px" }}
                                        >
                                            {pieChartData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            colors[
                                                                index %
                                                                    colors.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Legend
                                            layout="vertical"
                                            align="right"
                                            verticalAlign="bottom"
                                            iconType="circle"
                                            wrapperStyle={{
                                                right: -10,
                                                position: "absolute",
                                            }}
                                            formatter={(value) => (
                                                <Typography
                                                    sx={{
                                                        color:
                                                            theme.palette
                                                                .mode === "dark"
                                                                ? "white"
                                                                : "black",
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    {value}
                                                </Typography>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
};

export default Analytics;
