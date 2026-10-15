import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import axios from "axios";
//import { baseURL, api } from "../api";
import "../arendir-design.css";
import { FormSkeleton, PageFade } from "./PageLoader";
import api, { baseURL } from "../api";
import "./AnticiposGastosLocales.css"; // Mantén tu archivo CSS personalizado si es necesario
import { useNavigate } from "react-router-dom";
/* ── Estilos compartidos para uniformidad (tipografía, tamaños y botones) ── */
const FONT_DISPLAY = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

const topBtnSx = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
  border: "none", cursor: "pointer", minWidth: { xs: "100%", sm: 210 },
};
const cardSx = {
  borderRadius: "16px", border: "1px solid #E2E6F0",
  boxShadow: "0 2px 16px rgba(27,59,111,0.08)",
};
const titleSx = {
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24, color: "#1B3B6F",
};
const formFieldsSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px", fontFamily: FONT_BODY, fontSize: 15, background: "#F8F9FC",
    "& fieldset": { borderColor: "#E2E6F0" },
    "&:hover fieldset": { borderColor: "#1B3B6F" },
    "&.Mui-focused": { background: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#1B3B6F", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: FONT_DISPLAY, fontSize: 14, fontWeight: 600, color: "#9099B5",
    "&.Mui-focused": { color: "#1B3B6F" },
  },
};
const submitBtnSx = {
  mt: 4, height: 48, borderRadius: "12px", textTransform: "none",
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, backgroundColor: "#1B3B6F",
  boxShadow: "0 4px 12px rgba(27,59,111,0.3)",
  "&:hover": { backgroundColor: "#10233F" },
  "&.Mui-disabled": { backgroundColor: "#C9CEDD", color: "#fff" },
};
const dialogTitleSx = {
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: "#2D3350",
};
const dialogContentSx = {
  "& .MuiDialogContentText-root, & .MuiTypography-root, & .MuiFormControlLabel-label": {
    fontFamily: FONT_BODY,
  },
  "& .MuiTableCell-root": { fontFamily: FONT_BODY, fontSize: 14, color: "#2D3350" },
};
const dialogActionsSx = {
  px: 3, pb: 2, gap: 1,
  "& .MuiButton-root": {
    fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14,
    textTransform: "none", borderRadius: "10px", px: 2.5,
  },
  "& .MuiButton-colorPrimary": { color: "#1B3B6F" },
  "& .MuiButton-colorSecondary": { color: "#0C9A6C", fontWeight: 700 },
  "& .MuiButton-root.Mui-disabled": { color: "rgba(0,0,0,0.26)" },
};

const AnticiposGastosLocales = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2); // Asegura dos dígitos
    const day = `0${today.getDate()}`.slice(-2); // Asegura dos dígitos
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    dni: "",
    responsable: "",
    gerencia: "",
    tipo_anticipo: "GASTOS LOCALES",
    tipo_solicitud: "ANTICIPO",
    tipo_documento: "ANT",
    empresa: "",
    estado: "POR APROBAR",
    area: "",
    ceco: "",
    motivo: "",
    moneda: "PEN",
    banco: "",
    numero_cuenta: "",
    fecha_solicitud: getCurrentDate(),
    fecha_emision: getCurrentDate(),
    numero_rendicion: "",
    id_user: "",
    id_numero_rendicion: "",
    tipo_cambio: 1,
    id_empresa:"",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tipoCambio, setTipoCambio] = useState(1); // Valor inicial: 1 (PEN)

  // Agrega esta función
const fetchTipoCambio = async (fecha) => {
  try {
    const response = await axios.get(`${baseURL}/tipo-cambio/?fecha=${fecha}`);
    const precioVenta = response.data.precioVenta;
    setTipoCambio(precioVenta); // Guardar en el estado
    return precioVenta;
  } catch (error) {
    console.error("Error al obtener el tipo de cambio:", error);
    setTipoCambio(1); // Valor por defecto (PEN)
    return 1;
  }
};

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await api.get('/api/users/me/');
        const userData = userResponse.data;
        console.log(userData);
        console.log("userData", userData);
        let numeroRendicion = "";
        let idRendicion = 0;
        try {
          const rendicionResponse = await axios.get(
            `${baseURL}/solicitud/last`,
            {
              params: { id_user: userData.id, tipo: "ANTICIPO" }, // Ajusta el parámetro `tipo` según sea necesario
            }
          );
          numeroRendicion = rendicionResponse.data.nombre;
          idRendicion = rendicionResponse.data.id;
        } catch (error) {
          console.error("Error al obtener el numero_rendicion:", error);
        }

        setFormData({
          ...formData,
          usuario: userData.username,
          dni: userData.dni,
          responsable: userData.full_name,
          gerencia: userData.gerencia,
          area: userData.area,
          empresa: userData.company_name,
          ceco: userData.ceco,
          banco: userData.banco || "",
          numero_cuenta: userData.cuenta_bancaria || "",
          fecha_solicitud: getCurrentDate(),
          fecha_emision: getCurrentDate(),
          cuenta_contable: userData.cuenta_contable,
          numero_rendicion: numeroRendicion,
          id_user: userData.id,
          id_numero_rendicion: idRendicion,
          id_empresa: userData.id_empresa,
        });
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  const handleChange = async (e) => {
    const { name, value } = e.target;
  
    if (name === "moneda") {
      if (value === "USD" && formData.fecha_emision) {
        const cambio = await fetchTipoCambio(formData.fecha_emision);
        setFormData({
          ...formData,
          [name]: value,
          total: (parseFloat(formData.total || 0) * cambio),
          tipo_cambio: cambio
        });
      } else if (value === "PEN") {
        setFormData({
          ...formData,
          [name]: value,
          total: (parseFloat(formData.total || 0) / tipoCambio),
          tipo_cambio: 1
        });
      }
    } else if (name === "total") {
      const nuevoValor = parseFloat(value || 0);
      setFormData({
        ...formData,
        total: nuevoValor,
        importe_facturado: formData.moneda === "USD" ? nuevoValor * tipoCambio : nuevoValor,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/documentos/crear-con-pdf-local/`,
        formData
      );
      setResponseMessage("Anticipo creado correctamente.");
      setOpen(true);
    } catch (error) {
      setResponseMessage("Error al crear el documento.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    window.history.back();
  };
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const handleAnticipoGastosLocales = () => {
    navigate("/anticipos-gastos-locales");
  };

  const handleAnticipoViajes = () => {
    navigate("/anticipos-viajes");
  };

  return (
    <Container sx={{ paddingTop: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
          <Box component="button" className="ar-btn ar-btn-primary" onClick={handleAnticipoViajes} sx={topBtnSx}>
            <img src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa11.png?alt=media&token=6d72c9af-25f8-43b4-89e8-fb82b22224de"
              alt="" style={{ height: 18, filter: "brightness(0) invert(1)" }} />
            Anticipo Viajes
          </Box>

          <Box component="button" className="ar-btn ar-btn-orange" onClick={handleAnticipoGastosLocales} sx={topBtnSx}>
            <img src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa12.png?alt=media&token=605b5260-250c-4fb0-ade2-ff241845be1c"
              alt="" style={{ height: 18, filter: "brightness(0) invert(1)" }} />
            Anticipo Gastos Locales
          </Box>

          <Box component="button" className="ar-btn ar-btn-success" onClick={handleAnticipoGastosLocales} sx={topBtnSx}>
            <img src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa13.png?alt=media&token=7b15c497-d494-4a52-9011-ee7e6bdbe1e8"
              alt="" style={{ height: 18, filter: "brightness(0) invert(1)" }} />
            Finalizar Solicitud
          </Box>
        </Box>
      <Card sx={cardSx}>
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={titleSx}
          >
            Anticipos Gastos Locales
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2, ...formFieldsSx }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="motivo"
              label="Breve Motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="moneda"
              label="Moneda"
              name="moneda"
              select
              SelectProps={{
                native: true,
              }}
              value={formData.moneda}
              onChange={handleChange}
            >
              <option value="PEN">PEN</option>
              <option value="USD">USD</option>
            </TextField>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="fecha_emision"
              label="Fecha de Emisión"
              name="fecha_emision"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={formData.fecha_emision}
              onChange={handleChange}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="total"
              label="Presupuesto"
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={submitBtnSx}
            >
              {isLoading ? "Enviando..." : "Solicitar"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={dialogTitleSx}>Registro Exitoso</DialogTitle>
        <DialogContent sx={dialogContentSx}>
          <Typography>{responseMessage}</Typography>
        </DialogContent>
        <DialogActions sx={dialogActionsSx}>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        open={isLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default AnticiposGastosLocales;
