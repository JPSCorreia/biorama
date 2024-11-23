import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Grid,
    Paper,
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import { useState } from "react";
import { router } from '@inertiajs/react';
import { authStore } from "../Stores";

const Register = () => {

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleRegister = (e) => {
      e.preventDefault();
  
      router.post('/register', formData, {
          onSuccess: (page) => {
              if (page.props.auth && page.props.auth.user) {
                  authStore.setAuth(true);
                  authStore.setUser(page.props.auth.user);
                  console.log("Registration and login successful!");
              }
          },
          onError: (errors) => {
              console.error("Registration errors:", errors);
          },
      });
  };
  

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          marginTop: "10%",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.85),
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Registo de novo utilizador
          </Typography>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Primeiro nome"
                  variant="outlined"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ultimo nome"
                  variant="outlined"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirmar Password"
                  type="password"
                  variant="outlined"
                  required
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ mt: 2 }}
                >
                  Registar
                </Button>
              </Grid>
            </Grid>
          </form>

          <Box 
            sx={{ 
              mt: 3, 
              pt: 2, 
              borderTop: 1, 
              borderColor: 'divider',
              textAlign: 'center' 
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?
            </Typography>
            <Button
              onClick={() => router.visit('/login')}
              variant="text"
              sx={{ mt: 1 }}
            >
              Fazer Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
