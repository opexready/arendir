import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, MenuItem, Alert } from "@mui/material";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    company_name: "",
    role: "",
    area: "",
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
      const response = await axios.post("http://localhost:8000/users/", formData);
      setSuccess("Usuario registrado con éxito.");
      console.log(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrar usuario.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          ¡Comienza hoy!
        </Typography>
        <Typography variant="body2">No requiere tarjeta de crédito</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 3,
            backgroundColor: "#2E3192",
            "&:hover": { backgroundColor: "#1F237A" },
          }}
        >
          Empezar prueba gratuita
        </Button>
      </form>
    </Container>
  );
};

export default RegisterForm;
