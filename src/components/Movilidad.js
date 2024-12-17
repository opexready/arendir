import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Backdrop,
  MenuItem,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import esLocale from "date-fns/locale/es";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./Movilidad.css";
import { baseURL } from "../api";
import { useNavigate } from "react-router-dom";
import api from "../api";
import ubigeoData from "../data/ubigeoData";

const Movilidad = () => {
  const [formData, setFormData] = useState({
    origen: "",
    destino: "",
    motivo: "",
    estado: "POR APROBAR",
    tipo_gasto: "LOCAL",
    gastoDeducible: "",
    gastoNoDeducible: "",
    empresa: "",
    moneda: "PEN",
    total: "",
    cuenta_contable: 63112,
    rubro: "Movilidad",
    fecha_emision: null,
  });

  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const navigate = useNavigate();
  const [isOrigen, setIsOrigen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUbigeoDialog, setOpenUbigeoDialog] = useState(false);
  const openUbigeoDialogForField = (isForOrigen) => {
    setIsOrigen(isForOrigen);
    setOpenUbigeoDialog(true);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDepartamentoChange = (e) => {
    const departamento = e.target.value;
    setSelectedDepartamento(departamento);
    setProvincias(Object.keys(ubigeoData[departamento]));
    setSelectedProvincia("");
    setSelectedDistrito("");
  };

  const handleProvinciaChange = (e) => {
    const provincia = e.target.value;
    setSelectedProvincia(provincia);
    setDistritos(ubigeoData[selectedDepartamento][provincia]);
    setSelectedDistrito("");
  };

  const handleDistritoSelection = () => {
    if (isOrigen) {
      setFormData((prevState) => ({
        ...prevState,
        origen: selectedDistrito,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        destino: selectedDistrito,
      }));
    }
    setOpenUbigeoDialog(false);
  };

  useEffect(() => {
    const deducible = parseFloat(formData.gastoDeducible) || 0;
    const noDeducible = parseFloat(formData.gastoNoDeducible) || 0;
    setFormData((prevState) => ({
      ...prevState,
      total: deducible + noDeducible,
    }));
  }, [formData.gastoDeducible, formData.gastoNoDeducible]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("Form Data:", formData);
    let loggedInUser = "";
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        loggedInUser = decodedToken.sub;
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        alert("Token inválido. Por favor, inicie sesión nuevamente.");
        setIsLoading(false);
        return;
      }
    } else {
      console.error("Token no encontrado en localStorage.");
      setIsLoading(false);
      return;
    }

    // Obtener el numero_rendicion desde el endpoint
    let numeroRendicion = "|";
    let idRendicion;
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;

      if (userId) {
        const response = await api.get(`/rendicion/last`, {
          params: {
            user_id: userId,
            tipo: "RENDICION", // Puedes reemplazarlo con el valor que necesites
          },
        });
        if (response?.data?.nombre) {
          numeroRendicion = response.data.nombre;
          idRendicion = response.data.id;
        } else {
          console.error(
            "No se pudo obtener el valor de nombre de la última rendición."
          );
          alert(
            "No se pudo obtener el valor de la última rendición. Continuando con un valor predeterminado."
          );
        }
      } else {
        console.error(
          "Error: Usuario no autenticado o ID de usuario no encontrado."
        );
        alert(
          "Error: Usuario no autenticado. Por favor, inicie sesión nuevamente."
        );
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error al obtener la última rendición:", error);
      alert(
        "Error al obtener la última rendición. Usando valor predeterminado para numero_rendicion."
      );
    }

    const today = new Date().toISOString().split("T")[0];
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const dataToSend = {
      ...formData,
      fecha_solicitud: today,
      fecha_emision: formData.fecha_emision
        ? formData.fecha_emision.toISOString().split("T")[0]
        : today,
      usuario: loggedInUser,
      correlativo: "00000001",
      ruc: "00000000000",
      dni: user.dni,
      gerencia: user.gerencia,
      numero_rendicion: numeroRendicion,
      tipo_cambio: 1,
      afecto: 0,
      inafecto: 0,
      igv: 0,
      serie: "----",
      id_user: user.id,
      id_numero_rendicion: idRendicion,
      empresa: user.company_name,
    };

    try {
      await axios.post(`${baseURL}/generar-pdf-movilidad/`, dataToSend);
      setResponseMessage("Documento creado correctamente.");
      setOpen(true);
    } catch (error) {
      setResponseMessage("Error al crear el documento.");
      console.error(
        "Error al crear el documento:",
        error.response || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = async (registerAnother) => {
    setOpen(false);

    if (registerAnother) {
      try {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user?.id;

        if (!userId) {
          console.error(
            "Error: Usuario no autenticado o ID de usuario no encontrado."
          );
          alert(
            "Error: Usuario no autenticado. Por favor, inicie sesión nuevamente."
          );
          return;
        }
        const response = await api.get(`/rendicion/last`, {
          params: {
            user_id: userId,
            tipo: "RENDICION",
          },
        });
        if (response?.data?.nombre) {
          const { nombre } = response.data;
          console.log("Nombre de la última rendición:", nombre);
          navigate("/datos-recibo");
        } else {
          console.error(
            "Error: No se pudo obtener la información de la última rendición."
          );
          alert(
            "Error: No se pudo obtener la última rendición. Intente nuevamente."
          );
        }
      } catch (error) {
        console.error("Error al obtener la última rendición:", error);
        alert("Error al obtener la última rendición. Intente nuevamente.");
      }
    } else {
      // localStorage.removeItem("numero_rendicion");
      navigate("/datos-recibo-table");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: -20 }}>
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button
          variant="contained"
          color="warning"
          onClick={() => navigate(-1)} // Retrocede a la pestaña anterior
        >
          Regresar
        </Button>
      </Box>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" component="div" align="center" gutterBottom>
            Gastos de Movilidad
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={esLocale}
            >
              <DatePicker
                label="Fecha de Viaje"
                value={formData.fecha_emision}
                onChange={(newValue) =>
                  setFormData({ ...formData, fecha_emision: newValue })
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" required />
                )}
              />
            </LocalizationProvider>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Origen"
              value={formData.origen}
              onClick={() => openUbigeoDialogForField(true)}
              InputProps={{ readOnly: true }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Destino"
              value={formData.destino}
              onClick={() => openUbigeoDialogForField(false)}
              InputProps={{ readOnly: true }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Gasto Deducible"
              name="gastoDeducible"
              type="number"
              value={formData.gastoDeducible}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Total"
              name="total"
              type="number"
              value={formData.total}
              InputProps={{ readOnly: true }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              sx={{ marginTop: 4 }}
            >
              {isLoading ? "Enviando..." : "Solicitar"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Backdrop
        open={isLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Datos enviados con éxito</DialogTitle>
        <DialogContent>
          <Typography>{responseMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(true)} color="primary">
            Adicionar Gasto
          </Button>
          <Button onClick={() => handleClose(false)} color="secondary">
            Volver
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUbigeoDialog}
        onClose={() => setOpenUbigeoDialog(false)}
      >
        <DialogTitle>Selecciona Ubicación</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Departamento"
            value={selectedDepartamento}
            onChange={handleDepartamentoChange}
            fullWidth
            margin="normal"
          >
            {Object.keys(ubigeoData).map((dep) => (
              <MenuItem key={dep} value={dep}>
                {dep}
              </MenuItem>
            ))}
          </TextField>

          {provincias.length > 0 && (
            <TextField
              select
              label="Provincia"
              value={selectedProvincia}
              onChange={handleProvinciaChange}
              fullWidth
              margin="normal"
            >
              {provincias.map((prov) => (
                <MenuItem key={prov} value={prov}>
                  {prov}
                </MenuItem>
              ))}
            </TextField>
          )}

          {distritos.length > 0 && (
            <TextField
              select
              label="Distrito"
              value={selectedDistrito}
              onChange={(e) => setSelectedDistrito(e.target.value)}
              fullWidth
              margin="normal"
            >
              {distritos.map((dist) => (
                <MenuItem key={dist} value={dist}>
                  {dist}
                </MenuItem>
              ))}
            </TextField>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDistritoSelection} color="primary">
            Guardar
          </Button>
          <Button onClick={() => setOpenUbigeoDialog(false)} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Movilidad;
