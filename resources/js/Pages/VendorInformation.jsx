import {
    Avatar,
    Button,
    Paper,
    Typography,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    Container,
} from "@mui/material";
import { authStore } from "../Stores";
import { observer } from "mobx-react";
import { usePage } from "@inertiajs/react";

const VendorInformation = observer(() => {
    // Get user from Inertia page props
    const { user } = usePage().props;

    // Check if the user has the 'vendor' role
    const isVendor = authStore.user && authStore.user.role === "vendor";

    // If the user is a vendor, show a message indicating that vendor information is unavailable
    if (isVendor) {
        return (
            <Box sx={{ padding: 2 }}>
                <Typography variant="h6" color="error" align="center">
                    Informações de vendedor não disponíveis.
                </Typography>
            </Box>
        );
    }

    // Access theme properties using Material UI's theme hook
    const theme = useTheme();

    // Get media queries
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Paper
            elevation={4}
            sx={{
                p: 2,
                width: isSmallScreen ? "100%" : "80%",
                m: "auto",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderRadius: "10px",
            }}
        >
            <Box
                sx={{
                    margin: "2%",
                }}
            >
                <Box
                    sx={{
                        display: "flex", // Alinha os itens horizontalmente
                        alignItems: "center", // Centraliza verticalmente o Avatar e o Nome
                        gap: 2, // Espaço entre o Avatar e o Nome
                        marginBottom: "2%",
                    }}
                >
                    {/* User avatar with initials */}
                    <Avatar
                        alt="Profile Image"
                        variant={isSmallScreen ? "" : "rounded"}
                        sx={{
                            width: isSmallScreen ? 90 : 110,
                            height: isSmallScreen ? 90 : 110,
                            color: "background.secondary",
                            bgcolor: "primary.main",
                            borderRadius: isSmallScreen ? "50%" : "10px",
                            fontSize: isSmallScreen ? "1.5rem" : "3rem",
                        }}
                    >
                        {user.first_name[0]}
                        {user.last_name[0]}
                    </Avatar>

                    {/* Display user full name */}
                    <Box sx={{ ml: 2 }}>
                        <Typography
                            sx={{ fontWeight: "bold", fontSize: "2.3rem" }}
                        >
                            {user.first_name} {user.last_name}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                {/* Personal Information Section */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: isSmallScreen ? "column" : "row",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <Container sx={{ marginTop: "2%" }}>
                            <Typography
                                sx={{
                                    marginBottom: 1,
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                }}
                            >
                                {" "}
                                Dados Pessoais
                            </Typography>
                            <Box sx={{ marginBottom: "3%", p: 2 }}>
                                {/* Email & Telefone */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Email:
                                        </Typography>
                                        <Typography>{user.email}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Telefone:
                                        </Typography>
                                        <Typography>
                                            {user.phone || "Não disponível"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* NIF & Birthdate */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            NIF:
                                        </Typography>
                                        <Typography>{user.nif}</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Data de Nascimento:
                                        </Typography>
                                        <Typography>
                                            {user.date_of_birth ||
                                                "Não disponível"}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Address & Postal Code */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Morada:
                                        </Typography>
                                        <Typography>Exemplo</Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Cod. Postal & Cidade:
                                        </Typography>
                                        <Typography>2845-210 Seixal</Typography>
                                    </Box>
                                </Box>

                                {/* Gender */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Gênero:
                                        </Typography>
                                        <Typography>
                                            {user.gender?.name ||
                                                "Não disponível"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Container>

                        {/* Company Information Section */}
                        <Container sx={{ marginTop: "2%" }}>
                            <Typography
                                sx={{
                                    marginBottom: 1,
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                }}
                            >
                                {" "}
                                Dados de Empresa
                            </Typography>
                            <Box sx={{ marginBottom: "3%", p: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    {/* Company Name */}
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Nome da Empresa:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.company.name}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Email & Telephone */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Email:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.company.contacts.email}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Telefone:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.company.contacts.phone}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* NIF & Sector */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            NIF:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.company.nif}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Sector
                                        </Typography>
                                        <Typography>
                                            {user.vendor.company.sector}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Address & Postal Code */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isSmallScreen
                                            ? "column"
                                            : "row",
                                        flexWrap: "wrap",
                                        gap: 2,
                                        mb: 3,
                                    }}
                                >
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Morada:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.company.addresses
                                                .street +
                                                " " +
                                                user.vendor.company.addresses
                                                    .number}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: "1 1 45%" }}>
                                        <Typography fontWeight="bold">
                                            Cod. Postal & Cidade:
                                        </Typography>
                                        <Typography>
                                            {user.vendor.company.addresses
                                                .postal_code +
                                                " " +
                                                user.vendor.company.addresses
                                                    .district}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Container>
                    </Box>
                </Box>
            </Box>
            {/* Edit Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="outlined"
                    sx={{
                        width: "150px",
                        fontWeight: "bold",
                        border: "1px solid black",
                        color: "black",
                    }}
                >
                    Editar
                </Button>
            </Box>
        </Paper>
    );
});

export default VendorInformation;
