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
import api, { baseURL } from "../api";
import "./AnticiposGastosLocales.css"; // Mantén tu archivo CSS personalizado si es necesario
import { useNavigate } from "react-router-dom";
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
    <Container sx={{ marginTop: -20 }}>
      <Container sx={{ marginBottom: 2 }}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={handleAnticipoViajes}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa11.png?alt=media&token=6d72c9af-25f8-43b4-89e8-fb82b22224de"
              alt="Ícono de Anticipo Viajes"
              style={{ height: "24px" }} // Ajusta el tamaño de la imagen
            />
            Anticipo Viajes
          </Button>
          <Button
            variant="contained"
            color="warning"
            sx={{ marginRight: 2 }}
            onClick={handleAnticipoGastosLocales}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa12.png?alt=media&token=605b5260-250c-4fb0-ade2-ff241845be1c"
              alt="Ícono de Anticipo Gastos Locales"
              style={{ height: "24px" }} // Ajusta el tamaño de la imagen
            />
            Anticipo Gastos Locales
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ marginRight: 2 }}
            onClick={handleAnticipoGastosLocales}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa13.png?alt=media&token=7b15c497-d494-4a52-9011-ee7e6bdbe1e8"
              alt="Ícono de Finalizar Solicitud"
              style={{ height: "24px" }} // Ajusta el tamaño de la imagen
            />
            Finalizar Solicitud
          </Button>
        </Box>
      </Container>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              color: "#F15A29",
              fontWeight: "bold",
              margin: "0",
              fontSize: "1.5rem",
            }}
          >
            Anticipos Gastos Locales
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
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
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#2E3192",
                "&:hover": {
                  backgroundColor: "#1F237A",
                },
                color: "white",
                "&:disabled": {
                  backgroundColor: "#A5A5A5",
                  color: "#E0E0E0",
                },
              }}
            >
              {isLoading ? "Enviando..." : "Solicitar"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Registro Exitoso</DialogTitle>
        <DialogContent>
          <Typography>{responseMessage}</Typography>
        </DialogContent>
        <DialogActions>
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
