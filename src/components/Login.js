import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  CircularProgress
} from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados para recuperación de contraseña
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState({ text: "", severity: "info" });
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Manejo del login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await api.post("/token", { username, password });
      localStorage.setItem("token", response.data.access_token);

      const userResponse = await api.get("/api/users/me/", {
        headers: { Authorization: `Bearer ${response.data.access_token}` },
      });
      
      const user = userResponse.data;
      localStorage.setItem("user", JSON.stringify(user));

      // Redirección basada en rol
      const roleRoutes = {
        "ADMINISTRACION": "/administracion2",
        "APROBADOR": "/contador",
        "COLABORADOR": "/colaborador",
        "SOPORTE": "/soportePanel",
        "ADMIN": "/admin"
      };
      
      navigate(roleRoutes[user.role] || "/");
    } catch (error) {
      console.error("Login failed", error);
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Solicitud de restablecimiento
  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetMessage({ text: "Por favor ingresa tu correo electrónico", severity: "error" });
      return;
    }

    setIsLoading(true);
    setResetMessage({ text: "", severity: "info" });
    
    try {
      await api.post("/api/users/request-password-reset/", { email: resetEmail });
      setResetMessage({ 
        text: "Si el correo existe, recibirás un enlace para restablecer tu contraseña", 
        severity: "success" 
      });
      setResetEmail("");
      setShowResetForm(false);
    } catch (error) {
      setResetMessage({ 
        text: error.response?.data?.detail || "Error al enviar el enlace de recuperación", 
        severity: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Restablecimiento de contraseña
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!newPassword || !confirmPassword) {
      setResetMessage({ text: "Ambos campos son requeridos", severity: "error" });
      return;
    }
    
    if (newPassword.length < 8) {
      setResetMessage({ text: "La contraseña debe tener al menos 8 caracteres", severity: "error" });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setResetMessage({ text: "Las contraseñas no coinciden", severity: "error" });
      return;
    }

    setIsLoading(true);
    setResetMessage({ text: "", severity: "info" });
    
    try {
      await api.post("/api/users/reset-password/", {
        token: resetToken,
        new_password: newPassword
      });
      
      setResetMessage({ 
        text: "Contraseña actualizada. Redirigiendo...", 
        severity: "success" 
      });
      
      // Limpiar estados y redirigir
      setTimeout(() => {
        setNewPassword("");
        setConfirmPassword("");
        setShowResetPasswordForm(false);
        navigate("/login", { replace: true });
      }, 2000);
    } catch (error) {
      setResetMessage({ 
        text: error.response?.data?.detail || "Error al actualizar la contraseña", 
        severity: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar token en URL al cargar
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      setResetToken(token);
      setShowResetPasswordForm(true);
    }
  }, [location]);

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
        position: "relative",
        padding: 0,
        margin: 0,
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

      <Box sx={{ position: "absolute", bottom: "20px", left: "20px" }}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/iconoflecha.png?alt=media&token=a194d960-a3db-4b60-9436-6fea452060a0"
          alt="Icono de flecha"
          style={{ width: "40px", height: "40px" }}
        />
      </Box>
      
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
          BIENVENIDO A ARENDIR
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {showResetPasswordForm ? (
          <Box component="form" onSubmit={handlePasswordReset} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
              Restablecer contraseña
            </Typography>
            
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
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                sx={{
                  backgroundColor: "#2E3192",
                  "&:hover": { backgroundColor: "#1F237A" },
                  height: "42px"
                }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Cambiar contraseña"}
              </Button>
              
              <Button
                onClick={() => {
                  setShowResetPasswordForm(false);
                  navigate("/login");
                }}
                variant="outlined"
                fullWidth
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </Box>
            
            {resetMessage.text && (
              <Alert severity={resetMessage.severity} sx={{ mt: 2 }}>
                {resetMessage.text}
              </Alert>
            )}
          </Box>
        ) : showResetForm ? (
          <Box component="form" onSubmit={handleResetRequest} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
              Recuperar contraseña
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2, textAlign: "center" }}>
              Ingresa tu correo electrónico registrado
            </Typography>
            
            <TextField
              fullWidth
              margin="normal"
              label="Correo electrónico"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                fullWidth
                sx={{
                  backgroundColor: "#2E3192",
                  "&:hover": { backgroundColor: "#1F237A" },
                  height: "42px"
                }}
              >
                {isLoading ? <CircularProgress size={24} /> : "Enviar enlace"}
              </Button>
              
              <Button
                onClick={() => setShowResetForm(false)}
                variant="outlined"
                fullWidth
                disabled={isLoading}
              >
                Cancelar
              </Button>
            </Box>
            
            {resetMessage.text && (
              <Alert severity={resetMessage.severity} sx={{ mt: 2 }}>
                {resetMessage.text}
              </Alert>
            )}
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
                height: "42px"
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Iniciar Sesión"}
            </Button>
            
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 2, 
                textAlign: 'center', 
                color: '#2E3192',
                "&:hover": { textDecoration: 'underline' },
                cursor: 'pointer'
              }}
              onClick={() => setShowResetForm(true)}
            >
              ¿Olvidaste tu contraseña?
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Login;