import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import api from "../api"; // Importamos la instancia de API configurada

const RegisterForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    company_name: "",
    role: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;

      if (!userId) {
        setError("Error: Usuario no autenticado. Por favor, inicie sesión.");
        return;
      }

      const response = await api.post("/users/", {
        ...formData,
        user_id: userId,
      });

      setSuccess("Usuario registrado con éxito.");
      console.log("Respuesta del servidor:", response.data);
    } catch (err) {
      console.error("Error al registrar usuario:", err.response || err.message);
      setError(err.response?.data?.detail || "Error al registrar usuario.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center" }}>
        <Typography variant="h5">¡Comienza hoy!</Typography>
        <Typography variant="body2" color="textSecondary">
          No requiere tarjeta de crédito
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Apellido"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Empresa"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Rol"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="COLABORADOR">COLABORADOR</MenuItem>
            <MenuItem value="APROBADOR">APROBADOR</MenuItem>
            <MenuItem value="CONTADOR">CONTADOR</MenuItem>
          </TextField>
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <DialogActions>
            <Button
              onClick={onClose}
              type="submit"
              variant="contained"
              color="error"
              sx={{ marginRight: 2 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#2E3192",
                "&:hover": { backgroundColor: "#1F237A" },
              }}
            >
              Empezar prueba gratuita
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterForm;
