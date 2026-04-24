import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Box, Typography, Alert, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import "../arendir-design.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState({ text: "", severity: "info" });
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const response = await api.post("/token", { username, password });
      localStorage.setItem("token", response.data.access_token);
      const userResponse = await api.get("/api/users/me/", { headers: { Authorization: `Bearer ${response.data.access_token}` } });
      const user = userResponse.data;
      localStorage.setItem("user", JSON.stringify(user));
      const routes = { ADMINISTRACION: "/administracion2", APROBADOR: "/contador", COLABORADOR: "/colaborador", SOPORTE: "/soportePanel", ADMIN: "/admin" };
      navigate(routes[user.role] || "/");
    } catch {
      setError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    if (!resetEmail) { setResetMessage({ text: "Por favor ingresa tu correo electrónico", severity: "error" }); return; }
    setIsLoading(true);
    try {
      await api.post("/api/users/request-password-reset/", { email: resetEmail });
      setResetMessage({ text: "Si el correo existe, recibirás un enlace para restablecer tu contraseña", severity: "success" });
      setResetEmail(""); setShowResetForm(false);
    } catch (err) {
      setResetMessage({ text: err.response?.data?.detail || "Error al enviar el enlace", severity: "error" });
    } finally { setIsLoading(false); }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { setResetMessage({ text: "Ambos campos son requeridos", severity: "error" }); return; }
    if (newPassword.length < 8) { setResetMessage({ text: "Mínimo 8 caracteres", severity: "error" }); return; }
    if (newPassword !== confirmPassword) { setResetMessage({ text: "Las contraseñas no coinciden", severity: "error" }); return; }
    setIsLoading(true);
    try {
      await api.post("/api/users/reset-password/", { token: resetToken, new_password: newPassword });
      setResetMessage({ text: "Contraseña actualizada. Redirigiendo...", severity: "success" });
      setTimeout(() => { setShowResetPasswordForm(false); navigate("/login", { replace: true }); }, 2000);
    } catch (err) {
      setResetMessage({ text: err.response?.data?.detail || "Error al actualizar", severity: "error" });
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    if (token) { setResetToken(token); setShowResetPasswordForm(true); }
  }, [location]);

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1f5e 0%, #2E3192 45%, #3949AB 70%, #F15A29 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      px: 2,
    }}>
      {/* Decorative circles */}
      {[
        { size: 400, top: "-100px", right: "-100px", opacity: 0.06 },
        { size: 250, bottom: "-50px", left: "-80px", opacity: 0.08 },
        { size: 150, top: "30%", left: "5%", opacity: 0.05 },
      ].map((c, i) => (
        <Box key={i} sx={{
          position: "absolute", width: c.size, height: c.size, borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.3)", top: c.top, bottom: c.bottom, left: c.left, right: c.right,
          opacity: c.opacity, pointerEvents: "none",
          animation: `float ${3 + i}s ease-in-out infinite`,
          "@keyframes float": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        }} />
      ))}

      {/* Top bar */}
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 64, display: "flex", alignItems: "center", justifyContent: "flex-end", px: 3 }}>
        <Box component="img"
          src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
          alt="Arendir" sx={{ height: 36, opacity: 0.95 }} />
      </Box>

      {/* Card */}
      <Box sx={{
        width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderRadius: "20px",
        boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        p: { xs: 3, sm: 4 },
        mt: 2,
        animation: "cardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
        "@keyframes cardIn": { from: { opacity: 0, transform: "translateY(32px) scale(0.95)" }, to: { opacity: 1, transform: "translateY(0) scale(1)" } },
      }}>
        {/* Logo mark */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Box component="img"
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logo.png?alt=media&token=bf0a8b6f-f892-4884-aa3b-1e28a20f9f8b"
            alt="Arendir"
            sx={{ height: 64 }} />
        </Box>

        {showResetPasswordForm ? (
          <>
            <Typography sx={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 22, color: "#2D3350", textAlign: "center", mb: 0.5 }}>
              Nueva contraseña
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#9099B5", textAlign: "center", mb: 3 }}>
              Ingresa y confirma tu nueva contraseña
            </Typography>
            <Box component="form" onSubmit={handlePasswordReset} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField fullWidth label="Nueva contraseña" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                sx={inputSx} InputLabelProps={{ shrink: true }} />
              <TextField fullWidth label="Confirmar contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                sx={inputSx} InputLabelProps={{ shrink: true }} />
              {resetMessage.text && <Alert severity={resetMessage.severity} sx={{ borderRadius: "10px", fontSize: 13 }}>{resetMessage.text}</Alert>}
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <button type="button" className="ar-btn ar-btn-ghost" style={{ flex: 1 }} onClick={() => { setShowResetPasswordForm(false); navigate("/login"); }} disabled={isLoading}>
                  Cancelar
                </button>
                <button type="submit" className="ar-btn ar-btn-primary" style={{ flex: 1 }} disabled={isLoading}>
                  {isLoading ? <CircularProgress size={16} color="inherit" /> : "Guardar"}
                </button>
              </Box>
            </Box>
          </>
        ) : showResetForm ? (
          <>
            <Typography sx={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 22, color: "#2D3350", textAlign: "center", mb: 0.5 }}>
              Recuperar acceso
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#9099B5", textAlign: "center", mb: 3 }}>
              Te enviaremos un enlace a tu correo
            </Typography>
            <Box component="form" onSubmit={handleResetRequest} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField fullWidth label="Correo electrónico" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required
                sx={inputSx} InputLabelProps={{ shrink: true }} />
              {resetMessage.text && <Alert severity={resetMessage.severity} sx={{ borderRadius: "10px", fontSize: 13 }}>{resetMessage.text}</Alert>}
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <button type="button" className="ar-btn ar-btn-ghost" style={{ flex: 1 }} onClick={() => setShowResetForm(false)} disabled={isLoading}>
                  Volver
                </button>
                <button type="submit" className="ar-btn ar-btn-primary" style={{ flex: 1 }} disabled={isLoading}>
                  {isLoading ? <CircularProgress size={16} color="inherit" /> : "Enviar enlace"}
                </button>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Typography sx={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 24, color: "#2D3350", textAlign: "center", mb: 0.5 }}>
              Bienvenido a Arendir
            </Typography>
            <Typography sx={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#9099B5", textAlign: "center", mb: 3 }}>
              Ingresa tus credenciales para continuar
            </Typography>

            {error && (
              <Alert severity="error" sx={{ borderRadius: "10px", fontSize: 13, mb: 2, animation: "fadeUp 0.3s ease", "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                variant="outlined" fullWidth label="Usuario" value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username" autoFocus required
                InputLabelProps={{ shrink: true }} sx={inputSx}
              />
              <TextField
                variant="outlined" fullWidth label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password" required
                InputLabelProps={{ shrink: true }} sx={inputSx}
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#9099B5" }}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ) }}
              />

              <button type="submit" className="ar-btn ar-btn-primary ar-btn-lg ar-btn-full" disabled={isLoading}
                style={{ marginTop: 4, borderRadius: 12 }}>
                {isLoading ? <CircularProgress size={18} color="inherit" /> : "Iniciar sesión"}
              </button>

              <Typography
                sx={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#9099B5", cursor: "pointer", transition: "color 0.2s", "&:hover": { color: "#2E3192" } }}
                onClick={() => setShowResetForm(true)}
              >
                ¿Olvidaste tu contraseña?
              </Typography>
            </Box>
          </>
        )}
      </Box>

      {/* Bottom brand */}
      <Typography sx={{ mt: 3, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
        © 2026 Arendir Peru — Gestión de gastos empresariales
      </Typography>
    </Box>
  );
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    background: "#F8F9FC",
    "& fieldset": { borderColor: "#E2E6F0" },
    "&:hover fieldset": { borderColor: "#2E3192" },
    "&.Mui-focused fieldset": { borderColor: "#2E3192", borderWidth: "1.5px" },
    "&.Mui-focused": { background: "#fff" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#9099B5",
    "&.Mui-focused": { color: "#2E3192" },
  },
};

export default Login;
