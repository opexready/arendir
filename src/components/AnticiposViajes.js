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
  MenuItem,
} from "@mui/material";
import axios from "axios";
import "./AnticiposViajes.css";
import { baseURL, api } from "../api";
import ubigeoData from "../data/ubigeoData";

const AnticiposViajes = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2); // Asegura dos dígitos
    const day = `0${today.getDate()}`.slice(-2); // Asegura dos dígitos
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    usuario: "", // El usuario autenticado
    dni: "",
    responsable: "",
    gerencia: "",
    area: "",
    ceco: "",
    tipo_anticipo: "VIAJES",
    destino: "",
    motivo: "",
    empresa: "innova",
    estado: "POR APROBAR",
    fecha_emision: "", // Guardaremos la fecha de viaje aquí
    dias: "",
    moneda: "PEN",
    presupuesto: "",
    total: "",
    banco: "",
    numero_cuenta: "",
    tipo_viaje: "NACIONAL", // Valor por defecto "NACIONAL"
    fecha_solicitud: getCurrentDate(),
  });

  const [tipoViaje, setTipoViaje] = useState("NACIONAL");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUbigeoDialog, setOpenUbigeoDialog] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  // Obtener la información del usuario autenticado al cargar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegúrate de que el token esté en localStorage
          },
        });

        const userData = response.data;
        // Actualiza los datos del formulario con la información del usuario
        console.log("User ID:", userData.id); // <- Aquí está el log

        // Llama a la API de rendición usando el user_id
        const rendicionResponse = await axios.get(`${baseURL}/rendicion/last`, {
          params: { user_id: userData.id },
        });
        const rendicionData = rendicionResponse.data;

        // Imprime el campo "nombre" de la API de rendición
        console.log("Nombre de rendición:", rendicionData.nombre);

        setFormData({
          ...formData,
          usuario: userData.email,
          dni: userData.dni,
          responsable: userData.full_name,
          gerencia: userData.gerencia,
          area: userData.area,
          ceco: userData.ceco,
          banco: userData.banco || "", // Si no hay banco, dejar vacío
          numero_cuenta: userData.cuenta_bancaria || "",
          fecha_emision: getCurrentDate(),
          tipo_solicitud: "ANTICIPO",
          tipo_documento: "ANT",
          tipo_anticipo: "VIAJES",
          numero_rendicion: rendicionData.nombre,
          correlativo:"0001"
        });
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  // const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({
  //         ...formData,
  //         [name]: value
  //     });
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si el campo actualizado es "presupuesto", actualizamos "total" con el mismo valor
    if (name === "presupuesto") {
      setFormData({
        ...formData,
        presupuesto: value,
        total: value, // Reflejar el valor del presupuesto en el total
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleTipoViajeChange = (e) => {
    const tipo = e.target.value;
    setTipoViaje(tipo);
    setFormData({
      ...formData,
      tipo_viaje: tipo,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${baseURL}/documentos/crear-con-pdf-custom/`,
        formData
      );
      setResponseMessage("Anticipo creado correctamente");
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

  const handleDestinoSelection = () => {
    const distrito = selectedDistrito;
    setFormData((prevState) => ({
      ...prevState,
      destino: distrito,
    }));
    setOpenUbigeoDialog(false);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 10 }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              color: "#F15A29", // Color naranja
              fontWeight: "bold", // Texto en negrita
              margin: "0", // Elimina márgenes extra
              fontSize: "1.5rem", // Ajusta el tamaño de la fuente si es necesario
            }}
          >
            Anticipos de Viajes
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
            {/* Tipo de Viaje */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="tipo_viaje"
              label="Tipo de Viaje"
              name="tipo_viaje"
              select
              value={tipoViaje}
              onChange={handleTipoViajeChange}
            >
              <MenuItem value="NACIONAL">Viajes Nacionales</MenuItem>
              <MenuItem value="INTERNACIONAL">Viajes Internacionales</MenuItem>
            </TextField>

            {/* Si es Viaje Nacional, muestra el popup de ubicación */}
            {tipoViaje === "NACIONAL" ? (
              <>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setOpenUbigeoDialog(true)}
                  sx={{
                    mt: 2,
                    mb: 2,
                    color: "#2E3192", // Color del texto
                    borderColor: "#2E3192", // Color del borde
                    "&:hover": {
                      backgroundColor: "#F15A29", // Color de fondo al hacer hover
                      borderColor: "#F15A29", // Cambiar color de borde en hover
                      color: "white", // Cambiar color del texto a blanco en hover
                    },
                  }}
                >
                  Seleccionar Destino (Nacional)
                </Button>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.destino
                    ? `Destino seleccionado: ${formData.destino}`
                    : "No se ha seleccionado destino."}
                </Typography>
              </>
            ) : (
              // Si es Viaje Internacional, muestra el campo de texto
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="destino"
                label="Destino Internacional"
                name="destino"
                value={formData.destino}
                onChange={handleChange}
              />
            )}

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
              id="fecha_viaje"
              label="Fecha de Viaje"
              name="fecha_emision" // Actualizado para que se guarde en fecha_emision
              type="date"
              InputLabelProps={{
                shrink: true, // Esto asegura que la etiqueta se mantenga visible
              }}
              value={formData.fecha_emision} // Ahora utiliza fecha_emision
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="dias"
              label="Días"
              name="dias"
              type="number"
              value={formData.dias}
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
              id="presupuesto"
              label="Presupuesto"
              name="presupuesto"
              type="number"
              value={formData.presupuesto}
              onChange={handleChange}
            />
            {/* <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="total"
              label="Total"
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
            /> */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="total"
              label="Total"
              name="total"
              type="number"
              value={formData.total}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({
                  ...formData,
                  total: value,
                  importe_facturado: value, // Actualizar ambos valores
                });
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#2E3192", // Color de fondo
                "&:hover": {
                  backgroundColor: "#1F237A", // Color de fondo en hover
                },
                color: "white", // Color del texto
                "&:disabled": {
                  backgroundColor: "#A5A5A5", // Color de fondo cuando está deshabilitado
                  color: "#E0E0E0", // Color del texto cuando está deshabilitado
                },
              }}
            >
              {isLoading ? "Enviando..." : "Solicitar"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openUbigeoDialog}
        onClose={() => setOpenUbigeoDialog(false)}
      >
        <DialogTitle>Seleccionar Destino Nacional</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Departamento"
            fullWidth
            value={selectedDepartamento}
            onChange={handleDepartamentoChange}
            sx={{ mb: 2 }}
          >
            {Object.keys(ubigeoData).map((departamento) => (
              <MenuItem key={departamento} value={departamento}>
                {departamento}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Provincia"
            fullWidth
            value={selectedProvincia}
            onChange={handleProvinciaChange}
            disabled={!selectedDepartamento}
            sx={{ mb: 2 }}
          >
            {provincias.map((provincia) => (
              <MenuItem key={provincia} value={provincia}>
                {provincia}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Distrito"
            fullWidth
            value={selectedDistrito}
            onChange={(e) => setSelectedDistrito(e.target.value)}
            disabled={!selectedProvincia}
          >
            {distritos.map((distrito) => (
              <MenuItem key={distrito} value={distrito}>
                {distrito}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUbigeoDialog(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDestinoSelection} color="primary">
            Seleccionar
          </Button>
        </DialogActions>
      </Dialog>

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

export default AnticiposViajes;
