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
  MenuItem,
  TableContainer,
  DialogContentText,
  Paper,
  Table,
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
    empresa: "",
    estado: "POR APROBAR",
    fecha_emision: "",
    dias: "",
    moneda: "PEN",
    presupuesto: "",
    total: "",
    banco: "",
    numero_cuenta: "",
    tipo_viaje: "",
    numero_rendicion: "",
    fecha_solicitud: getCurrentDate(),
    id_user: "",
    id_numero_rendicion: "",
  });

  const [tipoViaje, setTipoViaje] = useState('NACIONAL');
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUbigeoDialog, setOpenUbigeoDialog] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedDistrito, setSelectedDistrito] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [ultimaSolicitud, setUltimaSolicitud] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentDetail, setDocumentDetail] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [documentoIdToDelete, setDocumentoIdToDelete] = useState(null);

  useEffect(() => {
    const fetchDocumentos = async () => {
      // Obtener userId y username del localStorage
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user ? user.id : null;
      const username = user ? user.email : null;
      const company_name = user ? user.company_name : null;
      console.log("company_name", company_name);
      // Extraer numero_rendicion usando el userId
      let numeroRendicion = "";
      try {
        const response = await axios.get(`${baseURL}/solicitud/last`, {
          params: { user_id: userId, tipo: "ANTICIPO" },
        });
        numeroRendicion = response.data.nombre;
        setUltimaSolicitud(response.data.nombre);
      } catch (error) {
        console.error("Error al obtener la última solicitud:", error);
      }

      try {
        const response = await axios.get(`${baseURL}/documentos/`, {
          params: {
            empresa: company_name,
            estado: "POR APROBAR",
            username: username,
            tipo_solicitud: "",
            tipo_anticipo: "",
            numero_rendicion: numeroRendicion,
            fecha_solicitud_from: "",
            fecha_solicitud_to: "",
            fecha_rendicion_from: "",
            fecha_rendicion_to: "",
            id_user: userId,
            id_numero_rendicion: "",
          },
        });
        console.log("Resultado de la solicitud:", response.data);
        setRecords(response.data);
      } catch (error) {
        console.error("Error al obtener los documentos:", error);
      }
    };

    fetchDocumentos();
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userId = user ? user.id : null;
    const fetchUltimaSolicitud = async () => {
      try {
        const response = await axios.get(`${baseURL}/solicitud/last`, {
          params: { user_id: userId, tipo: "ANTICIPO" },
        });
        setUltimaSolicitud(response.data.nombre);
      } catch (error) {
        console.error("Error al obtener la última solicitud:", error);
      }
    };
    fetchUltimaSolicitud();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = response.data;
        console.log("User ID:", userData.id);
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user ? user.id : null;
        const company_name = user ? user.company_name : null;
        const rendicionResponse = await axios.get(`${baseURL}/solicitud/last`, {
          params: { user_id: userId, tipo: "ANTICIPO" },
        });
        const rendicionData = rendicionResponse.data;
        console.log("Nombre de rendición:", rendicionData.nombre);
        setFormData({
          ...formData,
          empresa: company_name,
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
          id_user: userId,
          id_numero_rendicion: rendicionData.id,
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
    console.log("aca esta el tipo");
    console.log(tipo);
    setTipoViaje(tipo);
    setFormData({
      ...formData,
      tipo_viaje: tipo,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
   
    if (!tipoViaje) {
      setIsLoading(false);
      setResponseMessage("Por favor, elige un tipo de viaje.");
      setOpen(true);
      return;
    }

    const formData = {
      // ...other form data...
      tipo_viaje: tipoViaje,
    };

    try {
      console.log("request para crear pdf: " , formData.toString);
      await axios.post(`${baseURL}/documentos/crear-con-pdf-custom/`, formData);
      setResponseMessage("Anticipo creado correctamente.");
      setOpen(true);
    } catch (error) {
      setResponseMessage("Error al crear el documento.");
      console.error("Error:", error);
      setOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/anticipo-table"); // Redirige a la ruta deseada
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
    console.log("Archivo a visualizar:", fileLocation);
    setSelectedFile(fileLocation);
    setOpen(true);
  };

  const handleViewDetail = async (documentId) => {
    try {
      const response = await axios.get(`${baseURL}/documentos/${documentId}`);
      setDocumentDetail(response.data);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Error al obtener los detalles del documento:", error);
      setResponseMessage(
        "Error al obtener los detalles. Por favor, intente nuevamente."
      );
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setDocumentDetail(null);
  };

  const handleEditRecord = (record) => {
    console.log("Editar registro:", record);
  };

  const handleOpenConfirmDeleteDialog = (documentoId) => {
    setDocumentoIdToDelete(documentoId);
    setConfirmDeleteDialogOpen(true);
  };

  const handleCloseConfirmDeleteDialog = () => {
    setDocumentoIdToDelete(null);
    setConfirmDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (documentoIdToDelete) {
      try {
        await axios.delete(`${baseURL}/documentos/${documentoIdToDelete}`);
        setRecords(
          records.filter((record) => record.id !== documentoIdToDelete)
        );
        handleCloseConfirmDeleteDialog();
      } catch (error) {
        console.error("Error al eliminar el documento:", error);
        handleCloseConfirmDeleteDialog();
      }
    }
  };

  const [confirmFinalizarDialogOpen, setConfirmFinalizarDialogOpen] =
    useState(false);

  const handleOpenConfirmFinalizarDialog = () => {
    setConfirmFinalizarDialogOpen(true);
  };

  const handleCloseConfirmFinalizarDialog = () => {
    setConfirmFinalizarDialogOpen(false);
  };

  const handleFinalizarSolicitud = async () => {
    try {
      // Paso 1: Obtener la última rendición
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user ? user.id : null;

      if (!userId) {
        alert("Error: Usuario no autenticado");
        return;
      }

      const lastRendicionResponse = await axios.get(
        `${baseURL}/solicitud/last`,
        {
          params: {
            user_id: userId,
            tipo: "ANTICIPO",
          },
        }
      );

      if (lastRendicionResponse.data && lastRendicionResponse.data.id) {
        const rendicionId = lastRendicionResponse.data.id;

        // Paso 2: Actualizar la rendición obtenida a estado "PENDIENTE"
        await axios.put(`${baseURL}/solicitud/${rendicionId}`, {
          estado: "POR APROBAR",
        });

        // Paso 3: Crear una nueva rendición
        const newRendicionResponse = await axios.post(`${baseURL}/solicitud/`, {
          user_id: userId,
        });

        // Puedes manejar la respuesta según tus necesidades
        console.log("Nueva rendición creada:", newRendicionResponse.data);
      } else {
        console.log("No se encontró la última rendición para este usuario.");
      }
    } catch (error) {
      console.error("Error al finalizar la rendición:", error);
      setResponseMessage(
        "Error al finalizar la rendición. Por favor, intente nuevamente."
      );
    }
  };

  return (
    <Container sx={{ marginTop: -20 }}>
      <Container sx={{ marginBottom: 2 }}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={() => setShowForm(true)} // Mostrar formulario
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
            onClick={handleOpenConfirmFinalizarDialog}
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
      <Typography variant="h6" gutterBottom>
        SOLICITUD: {ultimaSolicitud}
      </Typography>
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
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 2 }}
          >
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
              error={!tipoViaje} // Muestra un error si no se ha seleccionado un tipo de viaje
              helperText={!tipoViaje ? "Por favor, elige un tipo de viaje" : ""}
            >
              <MenuItem value="NACIONAL">Elegir tipo</MenuItem>
              <MenuItem value="NACIONAL">Viajes Nacionales</MenuItem>
              <MenuItem value="INTERNACIONAL">Viajes Internacionales</MenuItem>
            </TextField>
            {tipoViaje === "NACIONAL" ? (
              <>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    console.log("Botón de selección de destino clickeado");
                    setOpenUbigeoDialog(true);
                  }}
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

      {/* Modal para confimar el registro */}
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

      {/* Modal para confimar el registro */}

      <Dialog
        open={detailDialogOpen}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalle del Documento</DialogTitle>
        <DialogContent>
          {documentDetail ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {Object.entries(documentDetail).map(
                    ([key, value]) =>
                      key !== "id" &&
                      key !== "archivo" && (
                        <TableRow key={key}>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {key}
                          </TableCell>
                          <TableCell>
                            {value ? value.toString() : "-"}
                          </TableCell>
                        </TableRow>
                      )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={handleCloseConfirmDeleteDialog}
      >
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <Typography>¿Desea eliminar este registro?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDeleteDialog} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Sí
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmFinalizarDialogOpen}
        onClose={handleCloseConfirmFinalizarDialog}
      >
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de finalizar la solicitud de anticipo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmFinalizarDialog} color="primary">
            No
          </Button>
          <Button
            onClick={async () => {
              setConfirmFinalizarDialogOpen(false);
              await handleFinalizarSolicitud(); // Llama a la función de finalizar solicitud
              navigate("/colaborador"); // Redirige a la página /colaborador
            }}
            color="secondary"
          >
            Sí
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUbigeoDialog}
        onClose={() => setOpenUbigeoDialog(false)}
        maxWidth="sm"
        fullWidth
        sx={{ "& .MuiDialog-paper": { padding: 3, borderRadius: 2 } }}
      >
        <DialogTitle>Seleccionar Destino</DialogTitle>
        <DialogContent>
          {/* Aquí puedes añadir los campos de selección de departamento, provincia y distrito */}
          <TextField
            select
            label="Departamento"
            value={selectedDepartamento}
            onChange={handleDepartamentoChange}
            fullWidth
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
            value={selectedProvincia}
            onChange={handleProvinciaChange}
            fullWidth
            disabled={!selectedDepartamento}
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
            value={selectedDistrito}
            onChange={(e) => setSelectedDistrito(e.target.value)}
            fullWidth
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
          <Button onClick={() => setOpenUbigeoDialog(false)}>Cancelar</Button>
          <Button onClick={handleDestinoSelection}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AnticiposViajes;
