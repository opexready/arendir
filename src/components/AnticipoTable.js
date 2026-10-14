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
//import { baseURL, api } from "../api";
import ubigeoData from "../data/ubigeoData";
import paisesSudamerica from "../data/paisesMundo";
import { useNavigate } from "react-router-dom";
import "../arendir-design.css";
import { TableSkeleton, PageFade } from "./PageLoader";
import api, { baseURL } from "../api";


/* ── Estilos compartidos para uniformidad (tipografía, tamaños y botones) ── */
const FONT_DISPLAY = "'Plus Jakarta Sans', sans-serif";
const FONT_BODY = "'DM Sans', sans-serif";

const headCellSx = {
  color: "rgba(255,255,255,0.95)", fontFamily: FONT_DISPLAY, fontWeight: 600,
  fontSize: 13, letterSpacing: "0.4px", py: 1.75, whiteSpace: "nowrap",
};
const bodyCellSx = {
  fontFamily: FONT_BODY, fontSize: 14, color: "#2D3350", py: 1.5,
  borderBottom: "1px solid #F0F2F8",
};
const actionBtnSx = {
  minWidth: 0, width: 56, height: 40, p: 0, borderRadius: "10px",
  textTransform: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
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
const formatMoney = (v) => {
  if (v === null || v === undefined || v === "") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(2) : v;
};
const topBtnSx = {
  display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
  border: "none", cursor: "pointer", minWidth: { xs: "100%", sm: 210 },
};

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
    empresa: "",
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
          params: { id_user: userId, tipo: "ANTICIPO" },
        });
        numeroRendicion = response.data.nombre;
        setUltimaSolicitud(response.data.nombre);
      } catch (error) {
        console.error("Error al obtener la última solicitud:", error);
      }

      try {
        const response = await axios.get(`${baseURL}/documentos/`, {
          params: {
            company_name: user.company_name,
            estado: "POR APROBAR",
            username: user.username,
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
          params: { id_user: userId, tipo: "ANTICIPO" },
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
        // const response = await axios.get(`${baseURL}/api/users/me`, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });
        // const response = await axios.get(`${baseURL}/api/users/me`, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });
        const response = await api.get("/api/users/me/");
        const userData = response.data;
        console.log(userData);
        console.log("User ID:", userData.id);
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user ? user.id : null;
        const rendicionResponse = await axios.get(`${baseURL}/solicitud/last`, {
          params: { id_user: userId, tipo: "ANTICIPO" },
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
            id_user: userId,
            tipo: "ANTICIPO",
          },
        }
      );

      if (lastRendicionResponse.data && lastRendicionResponse.data.id) {
        const rendicionId = lastRendicionResponse.data.id;

        // Paso 2: Actualizar la rendición obtenida a estado "PENDIENTE"
        await axios.put(`${baseURL}/api/solicitud/${rendicionId}`, {
          estado: "POR APROBAR",
        });

        // Paso 3: Crear una nueva rendición
        const newRendicionResponse = await axios.post(`${baseURL}/solicitud/`, {
          id_user: userId,
          id_empresa: user.id_empresa,
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

          <Box component="button" className="ar-btn ar-btn-success" onClick={handleOpenConfirmFinalizarDialog} sx={topBtnSx}>
            <img src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa13.png?alt=media&token=7b15c497-d494-4a52-9011-ee7e6bdbe1e8"
              alt="" style={{ height: 18, filter: "brightness(0) invert(1)" }} />
            Finalizar Solicitud
          </Box>
        </Box>
      <Box className="ar-rendicion-chip" sx={{ mb: 2, display: "inline-flex" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F15A29", display: "inline-block", marginRight: 6 }}></span>
        SOLICITUD: {ultimaSolicitud}
      </Box>
      {/* Grilla: Siempre visible */}
      {!showForm && (
        <TableContainer component={Paper} sx={{ marginBottom: 4, borderRadius: "12px", overflowX: "auto", boxShadow: "0 2px 16px rgba(27,59,111,0.08)", border: "1px solid #E2E6F0", WebkitOverflowScrolling: "touch" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1B3B6F" }}>
                <TableCell align="left" sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa14.png?alt=media&token=0adf0d7c-ba88-48a2-abee-864cbf6850e5"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Número de Ítem
                </TableCell>

                <TableCell align="left" sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa15.png?alt=media&token=3e9271c1-9533-4661-ab02-d30de0ad90e6"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Categoría
                </TableCell>

                <TableCell align="right" sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa16.png?alt=media&token=d8afd433-339c-4f9a-ab2d-b211e10345b2"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Total
                </TableCell>
                <TableCell align="center" sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa17.png?alt=media&token=aae19df1-ae52-45f4-8653-042af6b5a59b"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Ver Archivo
                </TableCell>
                <TableCell align="center" sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa18.png?alt=media&token=8228c7ef-c92f-478c-995a-2104ea29f3d4"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Detalle
                </TableCell>
                <TableCell align="center" sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa22.png?alt=media&token=554ee3ea-2338-48be-ba94-fd6535f34fc4"
                    alt="Ícono Número de Ítem"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Eliminar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow key={record.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell align="left" sx={bodyCellSx}>{index + 1}</TableCell>
                  <TableCell align="left" sx={bodyCellSx}>{record.tipo_anticipo}</TableCell>
                  <TableCell align="right" sx={bodyCellSx}>{formatMoney(record.total)}</TableCell>
                  <TableCell align="center" sx={bodyCellSx}>
                    {record.archivo && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleViewFile(record.archivo)}
                      sx={actionBtnSx}
                      title="Ver archivo"
                    >
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa17.png?alt=media&token=aae19df1-ae52-45f4-8653-042af6b5a59b"
                        alt="Ver Archivo"
                        style={{ height: "24px" }}
                      />
                    </Button>
                  )}
                  </TableCell>
                  <TableCell align="center" sx={bodyCellSx}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleViewDetail(record.id)}
                      sx={actionBtnSx}
                      title="Ver detalle"
                    >
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa18.png?alt=media&token=8228c7ef-c92f-478c-995a-2104ea29f3d4"
                        alt="Ver Detalle"
                        style={{ height: "24px" }}
                      />
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
                  <TableCell align="center" sx={bodyCellSx}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleOpenConfirmDeleteDialog(record.id)}
                      sx={actionBtnSx}
                      title="Eliminar"
                    >
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa22.png?alt=media&token=554ee3ea-2338-48be-ba94-fd6535f34fc4"
                        alt="Eliminar"
                        style={{ height: "24px" }}
                      />
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
        <DialogTitle sx={dialogTitleSx}>Anticipo registrado</DialogTitle>
        <DialogContent sx={dialogContentSx}>
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
        <DialogActions sx={dialogActionsSx}>
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
        <DialogTitle sx={dialogTitleSx}>Detalle del Documento</DialogTitle>
        <DialogContent sx={dialogContentSx}>
          {documentDetail ? (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {/* Información básica del documento */}
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Fecha de Solicitud
                    </TableCell>
                    <TableCell>
                      {documentDetail.fecha_solicitud
                        ? new Date(
                            documentDetail.fecha_solicitud + "T00:00:00"
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Tipo de Documento
                    </TableCell>
                    <TableCell>
                      {documentDetail.tipo_documento || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Tipo de Anticipo
                    </TableCell>
                    <TableCell>{documentDetail.tipo_anticipo || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Destino</TableCell>
                    <TableCell>{documentDetail.destino || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Motivo</TableCell>
                    <TableCell>{documentDetail.motivo || "-"}</TableCell>
                  </TableRow>

                  {/* Información financiera */}

                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                    <TableCell>{documentDetail.total || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Moneda</TableCell>
                    <TableCell>{documentDetail.moneda || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Tipo de Cambio
                    </TableCell>
                    <TableCell>{documentDetail.tipo_cambio || "-"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableSkeleton rows={5} cols={5} />
          )}
        </DialogContent>
        <DialogActions sx={dialogActionsSx}>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteDialogOpen}
        onClose={handleCloseConfirmDeleteDialog}
      >
        <DialogTitle sx={dialogTitleSx}>Confirmación</DialogTitle>
        <DialogContent sx={dialogContentSx}>
          <Typography>¿Desea eliminar este registro?</Typography>
        </DialogContent>
        <DialogActions sx={dialogActionsSx}>
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
        <DialogTitle sx={dialogTitleSx}>Confirmación</DialogTitle>
        <DialogContent sx={dialogContentSx}>
          <DialogContentText>
            ¿Estás seguro de finalizar la solicitud de anticipo?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={dialogActionsSx}>
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
        <DialogTitle sx={dialogTitleSx}>Seleccionar Destino</DialogTitle>
        <DialogContent sx={dialogContentSx}>
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
        <DialogActions sx={dialogActionsSx}>
          <Button onClick={() => setOpenUbigeoDialog(false)}>Cancelar</Button>
          <Button onClick={handleDestinoSelection}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AnticipoTable;
