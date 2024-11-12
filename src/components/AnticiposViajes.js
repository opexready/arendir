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
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import axios from "axios";
import "./AnticiposViajes.css";
import { baseURL, api } from "../api";
import ubigeoData from "../data/ubigeoData";
import paisesSudamerica from "../data/paisesMundo";
import { useNavigate } from "react-router-dom"; 

const AnticiposViajes = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `0${today.getMonth() + 1}`.slice(-2); 
    const day = `0${today.getDate()}`.slice(-2); 
    return `${year}-${month}-${day}`;
  };

  const navigate = useNavigate();
  const handleAnticipoGastosLocales = () => {
    navigate("/anticipos-gastos-locales");
  };

  const [formData, setFormData] = useState({
    usuario: "", 
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
    fecha_emision: "", 
    dias: "",
    moneda: "PEN",
    presupuesto: "",
    total: "",
    banco: "",
    numero_cuenta: "",
    tipo_viaje: "NACIONAL", 
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });
        const userData = response.data;
        console.log("User ID:", userData.id); 
        const rendicionResponse = await axios.get(`${baseURL}/rendicion/last`, {
          params: { user_id: userData.id },
        });
        const rendicionData = rendicionResponse.data;
        console.log("Nombre de rendición:", rendicionData.nombre);
        setFormData({
          ...formData,
          usuario: userData.email,
          dni: userData.dni,
          responsable: userData.full_name,
          gerencia: userData.gerencia,
          area: userData.area,
          ceco: userData.ceco,
          banco: userData.banco || "", 
          numero_cuenta: userData.cuenta_bancaria || "",
          fecha_emision: getCurrentDate(),
          tipo_solicitud: "ANTICIPO",
          tipo_documento: "ANT",
          tipo_anticipo: "VIAJES",
          numero_rendicion: rendicionData.nombre,
          correlativo: "0001",
        });
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };
    fetchUserData();
  }, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "presupuesto") {
      setFormData({
        ...formData,
        presupuesto: value,
        total: value, 
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

  const [showForm, setShowForm] = useState(false); 
  const [records, setRecords] = useState([]); 
  const handleViewFile = (fileLocation) => {
    console.log("Ver archivo:", fileLocation);
  };

  const handleViewDetail = (documentId) => {
    console.log("Ver detalles para documento:", documentId);
  };

  const handleEditRecord = (record) => {
    console.log("Editar registro:", record);
  };

  const handleOpenConfirmDeleteDialog = (documentId) => {
    console.log("Confirmar eliminación para documento:", documentId);
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: -20 }}>
      {/* Botones para mostrar los formularios */}
      <Container sx={{ marginBottom: 2 }}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={() => setShowForm(true)} // Mostrar formulario
          >
            Anticipo Viajes
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ marginRight: 2 }}
            onClick={handleAnticipoGastosLocales}
          >
            Anticipo Gastos Locales
          </Button>
        </Box>
      </Container>
  
      {/* Grilla: Siempre visible */}
      <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1F237A" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Número de Ítem
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Rubro
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Ver Archivo
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Detalle
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Editar
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Eliminar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record, index) => (
              <TableRow key={record.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{record.rubro}</TableCell>
                <TableCell>{record.total}</TableCell>
                <TableCell>
                  {record.archivo && (
                    <Button
                      variant="text"
                      onClick={() => handleViewFile(record.archivo)}
                    >
                      Ver
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleViewDetail(record.id)}
                  >
                    Ver Detalle
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditRecord(record)}
                  >
                    Editar
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleOpenConfirmDeleteDialog(record.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  
      {/* Formulario: Solo visible si showForm es true */}
      {showForm && (
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
              Anticipos de Viajes
            </Typography>
  
            {/* Aquí todo tu contenido del formulario */}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              {/* Campos del formulario */}
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
              {tipoViaje === "NACIONAL" ? (
                <>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setOpenUbigeoDialog(true)}
                    sx={{
                      mt: 2,
                      mb: 2,
                      color: "#2E3192",
                      borderColor: "#2E3192",
                      "&:hover": {
                        backgroundColor: "#F15A29",
                        borderColor: "#F15A29",
                        color: "white",
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="destino"
                  label="Destino Internacional"
                  name="destino"
                  select
                  value={formData.destino}
                  onChange={handleChange}
                >
                  {paisesSudamerica.map((pais) => (
                    <MenuItem key={pais} value={pais}>
                      {pais}
                    </MenuItem>
                  ))}
                </TextField>
              )}
  
              {/* Resto de los campos */}
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
                    importe_facturado: value,
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
      )}
    </Container>
  );
  
};

export default AnticiposViajes;
