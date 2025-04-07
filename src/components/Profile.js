import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  Typography,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  Divider
} from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    full_name: "",
    role: "",
    company_name: "",
    cargo: "",
    dni: "",
    zona_venta: "",
    area: "",
    ceco: "",
    gerencia: "",
    jefe_id: "",
    cuenta_bancaria: "",
    banco: "",
    newPassword: ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await api.get("/api/users/me/");
          setUser(userResponse.data);
          setFormData({
            ...userResponse.data,
            newPassword: ""
          });
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        setError("Error al cargar los datos del usuario");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        password: formData.newPassword || undefined
      };
      delete dataToSend.newPassword;

      const response = await api.put(`/api/users/${user.id}/`, dataToSend);
      if (response.data) {
        setSuccess("Datos actualizados correctamente");
        setError(null);
        setUser(response.data);
        setFormData({
          ...response.data,
          newPassword: ""
        });
      }
    } catch (error) {
      console.error("Error al actualizar los datos", error);
      setError("Error al actualizar los datos");
      setSuccess(null);
    }
  };

  return (
    <Container sx={{ marginTop: -15}}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: "#F15A29",
          fontWeight: "bold",
          mb: 4
        }}
      >
        Perfil de Usuario
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ boxShadow: 3 }}>
        <Box
          sx={{
            backgroundColor: "#2E3192",
            color: "white",
            p: 2,
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px"
          }}
        >
          <Typography variant="h6">Información del Usuario</Typography>
        </Box>
        
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Nombre de usuario"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Nombre completo"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Rol"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Empresa"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                disabled
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Cargo"
                name="cargo"
                value={formData.cargo || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="DNI"
                name="dni"
                value={formData.dni || ""}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Zona de venta"
                name="zona_venta"
                value={formData.zona_venta || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Área"
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="CECO"
                name="ceco"
                value={formData.ceco || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Gerencia"
                name="gerencia"
                value={formData.gerencia || ""}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Cuenta bancaria"
                name="cuenta_bancaria"
                value={formData.cuenta_bancaria || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Banco"
                name="banco"
                value={formData.banco || ""}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Nueva contraseña (dejar en blanco para no cambiar)"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#F15A29",
                  "&:hover": { backgroundColor: "#D44115" },
                  px: 4,
                  py: 1.5
                }}
              >
                Guardar cambios
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;