import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import api from "../api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    role: "",
    company_name: "",
    password: "",
  });

  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/companies/");
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("users/", formData);
      alert("Usuario creado exitosamente");
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      alert("No se pudo crear el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" component="div" align="center" gutterBottom>
            Registro de Usuario
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            <TextField
              label="Nombre de Usuario"
              name="username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              label="Correo Electrónico"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              label="Nombre Completo"
              name="full_name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <TextField
              select
              label="Rol"
              name="role"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem value="colaborador">Colaborador</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="contador">Contador</MenuItem>
            </TextField>
            <TextField
              select
              label="Empresa"
              name="company_name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.company_name}
              onChange={handleChange}
              required
            >
              {companies.map((company) => (
                <MenuItem key={company.id} value={company.name}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Registrar"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Backdrop
        open={isLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default Register;
