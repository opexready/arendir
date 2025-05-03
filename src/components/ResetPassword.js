import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", severity: "info" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extraer token de la URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage({ 
        text: "Token no encontrado. Por favor utiliza el enlace del correo electrónico.", 
        severity: "error" 
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!newPassword || !confirmPassword) {
      setMessage({ text: "Ambos campos son requeridos", severity: "error" });
      return;
    }
    
    if (newPassword.length < 8) {
      setMessage({ text: "La contraseña debe tener al menos 8 caracteres", severity: "error" });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden", severity: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", severity: "info" });
    
    try {
      await api.post("/api/users/reset-password/", {
        token: token,
        new_password: newPassword
      });
      
      setMessage({ 
        text: "Contraseña actualizada correctamente. Redirigiendo al login...", 
        severity: "success" 
      });
      
      // Limpiar y redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.detail || "Error al actualizar la contraseña. El token puede haber expirado.", 
        severity: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundImage: "url(https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/background1.png?alt=media&token=5feff8c0-6826-4cda-8851-05a2a9591c69)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(90deg, #7B1FA2, #F99E1E)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }} />
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
            alt="Logo"
            style={{ height: "40px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          mt: "80px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          p: 4,
          borderRadius: "8px",
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "#F15A29", fontWeight: "bold", textAlign: "center" }}
        >
          RESTABLECER CONTRASEÑA
        </Typography>
        
        {message.text && (
          <Alert severity={message.severity} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        {token ? (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              margin="normal"
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                backgroundColor: "#2E3192",
                "&:hover": { backgroundColor: "#1F237A" },
                height: "42px",
                mb: 2
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Cambiar contraseña"}
            </Button>
            
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{ height: "42px" }}
            >
              Volver al login
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: "#2E3192",
                "&:hover": { backgroundColor: "#1F237A" },
                mt: 2
              }}
            >
              Ir a la página de login
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ResetPassword;