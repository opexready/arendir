import React, { useState } from "react";
import "./RegisterForm.css";
import { CircularProgress } from "@mui/material";
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
import api from "../api";

const RegisterForm = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    company_name: "ARENDIR",
    role: "ADMIN",
    password: "Xrosdh223i",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;

      if (!userId) {
        setError("Error: Usuario no autenticado. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }

      const response = await api.post("/api/users/", {
        ...formData,
        id_user: userId,
      });

      setSuccess("Usuario registrado con éxito.");
      console.log("Respuesta del servidor:", response.data);

      try {
        const rendicionResponse = await api.post("/api/rendicion/", {
          id_user: response.data.id,
        });
        console.log(
          "Respuesta del servidor (rendicion):",
          rendicionResponse.data
        );
      } catch (rendicionError) {
        console.error(
          "Error al crear rendicion:",
          rendicionError.response || rendicionError.message
        );
      }
      try {
        const solicitudResponse = await api.post("/solicitud/", {
          id_user: response.data.id,
        });
        console.log(
          "Respuesta del servidor (solicitud):",
          solicitudResponse.data
        );
      } catch (solicitudError) {
        console.error(
          "Error al crear solicitud:",
          solicitudError.response || solicitudError.message
        );
      }

      setFormData({
        username: "",
        full_name: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.error("Error al registrar usuario:", err.response || err.message);
      setError(err.response?.data?.detail || "Error al registrar usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center" }}>
        <div className="title-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/AR31.png?alt=media&token=00ce3038-cf2f-411f-842d-c7be5c023299"
            alt="Icon"
            className="title-icon"
          />
          <div className="title-text">
            <Typography variant="h5" className="main-title">
              ¡Comienza hoy!
            </Typography>
            <Typography variant="body1" className="subtitle">
              Conoce las ventajas de la Prueba Gratuita de ARendir ¡No requiere
              tarjeta de crédito!
            </Typography>
          </div>
        </div>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
        <TextField
            label="Nombre de usuario"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Nombre Completo"
            name="full_name"
            value={formData.full_name}
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
          {/* <TextField
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          /> */}
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

            {/* <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                background:
                  "linear-gradient(90deg,#ff8b31, #FF6E40, #FF007B, #191b38)",
                color: "white",
                "&:hover": { backgroundColor: "#1F237A" },
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/AR32.png?alt=media&token=c65a01dd-a03a-4693-9846-b313645cd8eb"
                alt="Icon"
                style={{ width: "24px", height: "24px", marginRight: "8px" }}
              />
              Empezar prueba gratuita
            </Button> */}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                background: loading
                  ? "#ccc"
                  : "linear-gradient(90deg,#ff8b31, #FF6E40, #FF007B, #191b38)",
                color: "white",
                "&:hover": { backgroundColor: loading ? "#ccc" : "#1F237A" },
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                    position: "absolute",
                    left: "50%",
                    marginLeft: "-12px",
                  }}
                />
              )}
              <span
                style={{
                  opacity: loading ? 0 : 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/AR32.png?alt=media&token=c65a01dd-a03a-4693-9846-b313645cd8eb"
                  alt="Icono"
                  style={{ width: "24px", height: "24px", marginRight: "8px" }}
                />
                Empezar prueba gratuita
              </span>
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterForm;
