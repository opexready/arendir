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
  DialogContentText,
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
import lupaIcon from "../assets/lupa-icon.png";

const AnticipoTable = () => {
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

  const handleAnticipoViajes = () => {
    navigate("/anticipos-viajes");
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
    numero_rendicion: "",
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
            company_name: "innova",
            estado: "POR APROBAR",
            username: username,
            tipo_solicitud: "",
            tipo_anticipo: "",
            numero_rendicion: numeroRendicion,
            fecha_solicitud_from: "",
            fecha_solicitud_to: "",
            fecha_rendicion_from: "",
            fecha_rendicion_to: "",
          },
        });
        console.log("Resultado de la solicitud:", response.data);
        setRecords(response.data); // Almacenar el resultado en `records`
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
        const response = await axios.get(`${baseURL}/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = response.data;
        console.log("User ID:", userData.id);
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user ? user.id : null;
        const rendicionResponse = await axios.get(`${baseURL}/solicitud/last`, {
          params: { user_id: userId, tipo: "ANTICIPO" },
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
            sx={{
              marginRight: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
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
            color="success"
            sx={{
              marginRight: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
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
            color="warning"
            sx={{
              marginRight: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
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
      {/* Grilla: Siempre visible */}
      {!showForm && (
        <TableContainer component={Paper} sx={{ marginBottom: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1F237A" }}>
                <TableCell
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa14.png?alt=media&token=0adf0d7c-ba88-48a2-abee-864cbf6850e5"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Número de Ítem
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa15.png?alt=media&token=3e9271c1-9533-4661-ab02-d30de0ad90e6"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Categoria
                </TableCell>

                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa16.png?alt=media&token=d8afd433-339c-4f9a-ab2d-b211e10345b2"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Total
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa17.png?alt=media&token=aae19df1-ae52-45f4-8653-042af6b5a59b"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Ver Archivo
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa18.png?alt=media&token=8228c7ef-c92f-478c-995a-2104ea29f3d4"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Detalle
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa22.png?alt=media&token=554ee3ea-2338-48be-ba94-fd6535f34fc4"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Eliminar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={record.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.tipo_anticipo}</TableCell>{" "}
                  {/* Mostrar tipo_anticipo */}
                  <TableCell>{record.total}</TableCell> {/* Mostrar total */}
                  <TableCell>
                    {(() => {
                      console.log("Valor de record.archivo:", record.archivo); // Para verificar el valor
                      return (
                        record.archivo && (
                          <Button
                            variant="text"
                            onClick={() => handleViewFile(record.archivo)}
                          >
                            <img
                              src={lupaIcon}
                              alt="Ver Archivo"
                              style={{ width: 24 }}
                            />
                          </Button>
                        )
                      );
                    })()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="info"
                      onClick={() => handleViewDetail(record.id)}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa20.png?alt=media&token=38395495-e82e-418f-8dbe-ff366f3f45c2"
                        alt="Ícono Ver Detalle"
                        style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                      />
                      Ver Detalle
                    </Button>
                  </TableCell>
                  {/* <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditRecord(record)}
                  >
                    Editar
                  </Button>
                </TableCell> */}
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenConfirmDeleteDialog(record.id)}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa22.png?alt=media&token=554ee3ea-2338-48be-ba94-fd6535f34fc4"
                        alt="Ícono Eliminar"
                        style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                      />
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal para ver el archivo */}
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Anticipo registrado</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <iframe
              src={selectedFile}
              width="100%"
              height="600px"
              title="Archivo del Documento"
              frameBorder="0"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
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

export default AnticipoTable;
