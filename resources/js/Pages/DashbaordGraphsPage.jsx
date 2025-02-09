import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    Divider, LinearProgress, Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow,
    Typography,
    useMediaQuery
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
    LabelList, Cell, PieChart, Pie
} from 'recharts';

const COLORS = ['#4caf50', '#FFBB28', '#FF8042'];
const DashboardGraphsPage = () => {
    // Estados para guardar os dados do backend
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Para controle de responsividade
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Mobile
    const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md")); // Tablets
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg")); // Desktops grandes

    // Função para buscar os dados
    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/dashboard/data');
            setDashboardData(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erro ao carregar os dados.');
            setLoading(false);
        }
    };

    // Buscar os dados quando o componente monta
    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) return <p>Loading Data...</p>;
    if (error) return <p>{error}</p>;

    // Definir o tamanho dinâmico dos cartões com base na responsividade
    const cardWidth = isSmallScreen ? "100%" : isMediumScreen ? "45%" : "20%";

    // Função para preencher os meses de receita
    const fillMissingMonthsRevenue = (data) => {
        const months = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            total_revenue: 0
        }));
        data.forEach(item => {
            months[item.month - 1].total_revenue = item.total_revenue;
        });
        return months;
    };

// Função para preencher os meses de encomendas
    const fillMissingMonthsOrders = (data) => {
        const months = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            total_orders: 0
        }));
        data.forEach(item => {
            months[item.month - 1].total_orders = item.total_orders;
        });
        return months;
    };


    // Preparar dados anuais para os gráficos
    const prepareAnnualData = (currentData = [], lastYearData = [], type) => {
        const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

        const filledCurrentYear = type === 'revenue' ? fillMissingMonthsRevenue(currentData) : fillMissingMonthsOrders(currentData);
        const filledLastYear = type === 'revenue' ? fillMissingMonthsRevenue(lastYearData) : fillMissingMonthsOrders(lastYearData);

        return filledCurrentYear.map((item, index) => ({
            month: months[index],
            currentYear: type === 'revenue' ? item.total_revenue : item.total_orders,
            previousYear: type === 'revenue' ? filledLastYear[index].total_revenue : filledLastYear[index].total_orders
        }));
    };


    // Preparar os dados para os gráficos
    const annualOrdersData = prepareAnnualData(
        dashboardData.annual_orders_current_year,
        dashboardData.annual_orders_last_year,
        'orders'
    );
    const annualRevenueData = prepareAnnualData(
        dashboardData.monthly_revenue_current_year,
        dashboardData.monthly_revenue_last_year,
        'revenue'
    );
    const monthlyRevenueData = [
        { month: 'Mês Anterior', revenue: dashboardData.revenue_last_month || 0 },
        { month: 'Este Mês', revenue: dashboardData.revenue_current_month || 0 }
    ];

    const pieChartData = dashboardData.stores.map(store => ({
        name: store.name,
        treated: store.treated_percentage
    }));

    return (
        <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 13, padding: 2, justifyContent: 'center' }}>

                {/* Card 1 */}
                <Card sx={{
                    width: cardWidth,
                    height: "100px",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 2,
                    position: 'relative'
                }}>
                    <CardContent sx={{ padding: '0px' }}>
                        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Receita Hoje</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 24 }}>
                            €{dashboardData.revenue_today}
                        </Typography>
                        <Divider />
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Typography sx={{
                                fontSize: 13,
                                fontWeight: 'bold',
                                color: dashboardData.todayDiffPercentage >= 0 ? 'green' : 'red'
                            }}>
                                {dashboardData.today_diff_percentage}%
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                                que a semana passada
                            </Typography>
                        </Box>
                    </CardContent>
                    <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: '#000',
                        padding: '8px',
                        borderRadius: '10%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 30, color: 'white' }} />
                    </Box>
                </Card>

                {/* Card 2 */}
                <Card sx={{
                    width: cardWidth,
                    height: "100px",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 2,
                    position: 'relative'
                }}>
                    <CardContent sx={{ padding: '0px' }}>
                        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Receita Mês Corrente</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 24 }}>
                            €{dashboardData.revenue_current_month}
                        </Typography>
                        <Divider />
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Typography sx={{
                                fontSize: 13,
                                fontWeight: 'bold',
                                color: dashboardData.month_diff_percentage >= 0 ? 'green' : 'red'
                            }}>
                                {dashboardData.month_diff_percentage}%
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                                que o mês passado
                            </Typography>
                        </Box>
                    </CardContent>
                    <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: '#000',
                        padding: '8px',
                        borderRadius: '10%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <PointOfSaleIcon sx={{ fontSize: 30, color: 'white' }} />
                    </Box>
                </Card>

                {/* Card 3 */}
                <Card sx={{
                    width: cardWidth,
                    height: "100px",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 2,
                    position: 'relative'
                }}>
                    <CardContent sx={{ padding: '0px' }}>
                        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Receita Este Ano</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 24 }}>
                            €{dashboardData.revenue_current_year}
                        </Typography>
                        <Divider />
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Typography sx={{
                                fontSize: 13,
                                fontWeight: 'bold',
                                color: dashboardData.year_diff_percentage >= 0 ? 'green' : 'red'
                            }}>
                                {dashboardData.year_diff_percentage}%
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                                que o ano passado
                            </Typography>
                        </Box>
                    </CardContent>
                    <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: '#000',
                        padding: '8px',
                        borderRadius: '10%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <AccountBalanceIcon sx={{ fontSize: 30, color: 'white' }} />
                    </Box>
                </Card>

                {/* Card 4 */}
                <Card sx={{
                    width: cardWidth,
                    height: "100px",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 2,
                    position: 'relative'
                }}>
                    <CardContent sx={{ padding: '0px' }}>
                        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>Total de Encomendas</Typography>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 24 }}>
                            {dashboardData.total_orders_current_year}
                        </Typography>
                        <Divider />
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Typography sx={{
                                fontSize: 13,
                                fontWeight: 'bold',
                                color: 'red'
                            }}>
                                {dashboardData.cancelled_percentage}%
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                                de encomendas canceladas
                            </Typography>
                        </Box>
                    </CardContent>
                    <Box sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: '#000',
                        padding: '8px',
                        borderRadius: '10%',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ShoppingCartIcon sx={{ fontSize: 30, color: 'white' }} />
                    </Box>
                </Card>
            </Box>

            <Box sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3,  }}>
                    {/* Gráfico de barras: Receita Mensal */}
                    <Card sx={{ flex: 1, minWidth: '300px', backgroundColor:"white", borderRadius: '2%', p:1 }}>
                        <Typography variant="h6" sx={{ paddingBottom: 2 }}>Receita Mensal (Comparação)</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyRevenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#4caf50" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Gráfico de linhas: Encomendas Anuais */}
                    <Card sx={{ flex: 1, minWidth: '300px', backgroundColor:"white", borderRadius: '2%', p:1  }}>
                        <Typography variant="h6" sx={{ paddingBottom: 2 }}>Encomendas Anuais (Comparação)</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={annualOrdersData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="currentYear" stroke="#4caf50" name="Este Ano" />
                                <Line type="monotone" dataKey="previousYear" stroke="#FF8042" name="Ano Passado" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Gráfico de linhas: Receita Anual */}
                    <Card sx={{ flex: 1, minWidth: '300px', backgroundColor:"white", borderRadius: '2%', p:1  }}>
                        <Typography variant="h6" sx={{ paddingBottom: 2 }}>Receita Anual (Comparação)</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={annualRevenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="currentYear" stroke="#4caf50" name="Este Ano" />
                                <Line type="monotone" dataKey="previousYear" stroke="#FF8042" name="Ano Passado" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Box>
                <Box sx={{ padding: 2 }}>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        {/* Tabela: Faturamento e Encomendas */}
                        <Card sx={{ flex: 1, padding: 3 }}>
                            <Typography variant="h6" sx={{ paddingBottom: 2 }}>Faturamento e Encomendas por Loja</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Loja</TableCell>
                                            <TableCell align="right">Faturamento (€)</TableCell>
                                            <TableCell align="right">Encomendas</TableCell>
                                            <TableCell align="right">% Tratadas</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dashboardData.stores.map((store, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{store.name}</TableCell>
                                                <TableCell align="right">€{store.total_revenue.toFixed(2)}</TableCell>
                                                <TableCell align="right">{store.total_orders}</TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={store.treated_percentage}
                                                            sx={{
                                                                width: '100%',
                                                                height: 10,
                                                                borderRadius: 5,
                                                                backgroundColor: '#e0e0e0',  // Fundo da barra
                                                                '& .MuiLinearProgress-bar': {
                                                                    backgroundColor:
                                                                        store.treated_percentage >= 90 ? '#4caf50' :
                                                                            store.treated_percentage >= 55 ? '#FFBB28' :
                                                                                '#FF8042'
                                                                }
                                                            }}
                                                        />
                                                        <Typography sx={{ fontSize: 12, minWidth: 35 }}>
                                                            {Math.round(store.treated_percentage)}%
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>

                        {/* Gráfico Circular */}
                        <Card sx={{ flex: 1, padding: 3 }}>
                            <Typography variant="h6" sx={{ paddingBottom: 2 }}>Percentagem de Encomendas Tratadas</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        dataKey="treated"
                                        nameKey="name"
                                        outerRadius={100}
                                        label={({ name, treated }) => `${name}: ${Math.round(treated)}%`}
                                        labelStyle={{
                                            fill: theme.palette.mode === 'dark' ? 'white' : 'black',
                                            fontWeight: 'bold',
                                            fontSize: '12px'
                                        }}
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend
                                        layout="vertical"
                                        align="right"
                                        iconType="circle"
                                        formatter={(value) => (
                                            <Typography sx={{ color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: 12 }}>{value}</Typography>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardGraphsPage;
