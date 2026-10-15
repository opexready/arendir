import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../arendir-design.css";
import { ProfileSkeleton, PageFade } from "./PageLoader";
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
  Divider,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from "@mui/material";

/* ── Estilos compartidos para uniformidad (tipografía, tamaños y botones) ── */
const FONT_DISPLAY = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

const titleSx = {
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24, color: "#1B3B6F", mb: 3,
};
const cardSx = {
  borderRadius: "16px", border: "1px solid #E2E6F0", overflow: "hidden",
  boxShadow: "0 2px 16px rgba(27,59,111,0.08)",
};
const alertSx = { mb: 3, borderRadius: "10px", fontFamily: FONT_BODY, fontSize: 14 };
const rowSx = { display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 };
const formFieldsSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px", fontFamily: FONT_BODY, fontSize: 15, background: "#F8F9FC",
    "& fieldset": { borderColor: "#E2E6F0" },
    "&:hover fieldset": { borderColor: "#1B3B6F" },
    "&.Mui-focused": { background: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#1B3B6F", borderWidth: "1.5px" },
    "&.Mui-disabled": { background: "#F0F2F8" },
    "&.Mui-disabled fieldset": { borderColor: "#E2E6F0" },
    "& .Mui-disabled": { WebkitTextFillColor: "#8A93AE" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: "#9099B5",
    "&.Mui-focused": { color: "#1B3B6F" },
    "&.Mui-disabled": { color: "#9099B5" },
  },
};
const submitBtnSx = {
  px: 4, height: 48, borderRadius: "12px", textTransform: "none",
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, backgroundColor: "#1B3B6F",
  boxShadow: "0 4px 12px rgba(27,59,111,0.3)",
  "&:hover": { backgroundColor: "#10233F" },
  "&.Mui-disabled": { backgroundColor: "#C9CEDD", color: "#fff" },
};
const menuProps = {
  PaperProps: { sx: { borderRadius: "10px", "& .MuiMenuItem-root": { fontFamily: FONT_BODY, fontSize: 14 } } },
};

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

const bancosPeru = [
    "Banco de Crédito del Perú (BCP)",
    "BBVA Perú",
    "Scotiabank Perú",
    "Interbank",
    "Banco Pichincha",
    "Banco de la Nación",
    "Banco GNB Perú",
    "Banco Falabella",
    "Banco Ripley",
    "Banco Santander Perú",
    "Banco Azteca",
    "MiBanco",
    "Banco Cencosud",
    "Banco Continental",
    "Banco Financiero",
    "Banco Interamericano de Finanzas (BIF)",
    "Citibank Perú",
    "Banco HSBC",
    "Banco Internacional del Perú - Interbank",
    "Banco de Comercio"
  ];

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
    <Container sx={{ marginTop: 0}}>
      <Typography variant="h4" align="center" gutterBottom sx={titleSx}>
        Perfil de Usuario
      </Typography>

      {error && (
        <Alert severity="error" sx={alertSx}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={alertSx}>
          {success}
        </Alert>
      )}

      <Card sx={cardSx}>
        <Box sx={{ backgroundColor: "#1B3B6F", color: "white", px: 3, py: 2 }}>
          <Typography sx={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18 }}>Información del Usuario</Typography>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, ...formFieldsSx }}>
            <Box sx={rowSx}>
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

            <Box sx={rowSx}>
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

            <Box sx={rowSx}>
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

            <Box sx={rowSx}>
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

            <Box sx={rowSx}>
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

            <Box sx={rowSx}>
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
              <FormControl fullWidth>
                <InputLabel id="banco-label">Banco</InputLabel>
                <Select
                  labelId="banco-label"
                  label="Banco"
                  name="banco"
                  value={formData.banco || ""}
                  onChange={handleChange}
                  variant="outlined"
                  MenuProps={menuProps}
                >
                  <MenuItem value="">
                    <em>Seleccionar banco</em>
                  </MenuItem>
                  {bancosPeru.map((banco) => (
                    <MenuItem key={banco} value={banco}>
                      {banco}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                sx={submitBtnSx}
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
