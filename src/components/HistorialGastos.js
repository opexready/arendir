import React, { useEffect, useState } from "react";
import "../arendir-design.css";
import { TableSkeleton, PageFade } from "./PageLoader";
import {
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  FormControl,
  InputLabel,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import { baseURL } from "../api";


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
const paperSx = {
  borderRadius: "12px", border: "1px solid #E2E6F0",
  boxShadow: "0 2px 16px rgba(27,59,111,0.08)",
};
const filterBtnSx = {
  backgroundColor: "#1B3B6F", color: "#fff", height: 44, borderRadius: "10px",
  textTransform: "none", fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14, gap: 1,
  boxShadow: "0 4px 12px rgba(27,59,111,0.3)", "&:hover": { backgroundColor: "#10233F" },
};
const toggleBtnSx = {
  backgroundColor: "#F15A29", color: "#fff", minWidth: 110, height: 40, borderRadius: "10px",
  textTransform: "none", fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13,
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)", "&:hover": { backgroundColor: "#D44A1C" },
};

const HistorialGastos = () => {
  const [rendiciones, setRendiciones] = useState([]);
  const [estado, setEstado] = useState("");
  const [tipo, setTipo] = useState("RENDICION");
  const [fechaRegistroFrom, setFechaRegistroFrom] = useState("");
  const [fechaRegistroTo, setFechaRegistroTo] = useState("");
  const [openRendiciones, setOpenRendiciones] = useState({});
  const [documentDetail, setDocumentDetail] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openFileDialog, setOpenFileDialog] = useState(false);

  const fetchRendiciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user?.id;
      const response = await axios.get(`${baseURL}/api/rendiciones/con-documentos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tipo: tipo || undefined,
          estado: estado || undefined,
          fecha_registro_from: fechaRegistroFrom || undefined,
          fecha_registro_to: fechaRegistroTo || undefined,
          id_user: userId,
        },
      });
      console.log("Respuesta de la API:", response.data);
      setRendiciones(response.data);
      setOpenRendiciones({});
    } catch (error) {
      console.error("Error al obtener las rendiciones:", error);
    }
  };

  useEffect(() => {
    fetchRendiciones();
  }, []);

  const toggleRendicion = (id) => {
    setOpenRendiciones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleViewDetail = async (documentId) => {
    try {
      const response = await axios.get(`${baseURL}/documentos/${documentId}`);
      setDocumentDetail(response.data);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Error al obtener los detalles del documento:", error);
    }
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setDocumentDetail(null);
  };

  const handleViewFile = (fileLocation) => {
    setSelectedFile(fileLocation);
    setOpenFileDialog(true);
  };

  const handleCloseFileDialog = () => {
    setOpenFileDialog(false);
    setSelectedFile(null);
  };

  const rowStyle = {
    backgroundColor: "#F8F9FC",
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 0 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: "#1B3B6F",
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          margin: "0 0 16px",
          fontSize: 24,
        }}
      >
        Detalle de Rendiciones
      </Typography>

      {/* Filtros */}
      <Paper elevation={0} sx={{ ...paperSx, padding: 3, marginBottom: 3, "& .MuiInputBase-root, & .MuiInputLabel-root": { fontFamily: FONT_BODY } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="POR APROBAR">POR APROBAR</MenuItem>
                <MenuItem value="APROBADO">POR ABONAR</MenuItem>
                <MenuItem value="ABONADO">ABONADO</MenuItem>
                <MenuItem value="TERMINADO">TERMINADO</MenuItem>
                <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="tipo-label">Tipo</InputLabel>
              <Select
                labelId="tipo-label"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <MenuItem value="RENDICION">RENDICIÓN</MenuItem>
                <MenuItem value="ANTICIPO">ANTICIPO</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Fecha Registro Desde"
              type="date"
              fullWidth
              value={fechaRegistroFrom}
              onChange={(e) => setFechaRegistroFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Fecha Registro Hasta"
              type="date"
              fullWidth
              value={fechaRegistroTo}
              onChange={(e) => setFechaRegistroTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={fetchRendiciones}
              sx={filterBtnSx}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                alt="Ícono Eliminar"
                style={{ height: "24px" }}
              />
              Aplicar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de Rendiciones */}
      <Paper elevation={0} sx={{ ...paperSx, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#1B3B6F" }}>
                <TableCell sx={headCellSx}>Nombre</TableCell>
                <TableCell sx={headCellSx}>Tipo</TableCell>
                <TableCell sx={headCellSx}>Estado</TableCell>
                <TableCell sx={headCellSx}>Fecha Registro</TableCell>
                <TableCell sx={headCellSx}>Fecha Actualización</TableCell>
                <TableCell align="center" sx={headCellSx}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rendiciones.map((item) => {
                const data = item.rendicion || item.solicitud;
                return (
                  <React.Fragment key={data.id}>
                    <TableRow hover>
                      <TableCell sx={bodyCellSx}>{data.nombre}</TableCell>
                      <TableCell sx={bodyCellSx}>{data.tipo}</TableCell>
                      <TableCell sx={bodyCellSx}>{data.estado}</TableCell>
                      <TableCell sx={bodyCellSx}>{data.fecha_registro}</TableCell>
                      <TableCell sx={bodyCellSx}>{data.fecha_actualizacion || "N/A"}</TableCell>
                      <TableCell align="center" sx={bodyCellSx}>
                        <Button
                          onClick={() => toggleRendicion(data.id)}
                          size="small"
                          sx={toggleBtnSx}
                        >
                          {openRendiciones[data.id] ? (
                            <>
                              Cerrar
                              <ExpandLess />
                            </>
                          ) : (
                            <>
                              Abrir
                              <ExpandMore />
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {/* Subnivel de documentos */}
                    <TableRow>
                      <TableCell colSpan={6} style={{ padding: 0, border: "none" }}>
                        <Collapse
                          in={openRendiciones[data.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow sx={{ backgroundColor: "#2C5599" }}>
                                <TableCell sx={headCellSx}>RUC</TableCell>
                                <TableCell sx={headCellSx}>Proveedor</TableCell>
                                <TableCell sx={headCellSx}>Fecha Emisión</TableCell>
                                <TableCell sx={headCellSx}>Moneda</TableCell>
                                <TableCell sx={headCellSx}>Tipo Documento</TableCell>
                                <TableCell align="right" sx={headCellSx}>Total</TableCell>
                                <TableCell align="center" sx={headCellSx}>Ver Archivo</TableCell>
                                <TableCell align="center" sx={headCellSx}>Detalle</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {item.documentos.map((doc) => (
                                <TableRow key={doc.id} style={rowStyle}>
                                  <TableCell sx={bodyCellSx}>{doc.ruc}</TableCell>
                                  <TableCell sx={bodyCellSx}>{doc.proveedor}</TableCell>
                                  <TableCell sx={bodyCellSx}>{doc.fecha_emision}</TableCell>
                                  <TableCell sx={bodyCellSx}>{doc.moneda}</TableCell>
                                  <TableCell sx={bodyCellSx}>{doc.tipo_documento}</TableCell>
                                  <TableCell align="right" sx={bodyCellSx}>{formatMoney(doc.total)}</TableCell>
                                  <TableCell align="center" sx={bodyCellSx}>
                                    {doc.archivo && (
                                      <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleViewFile(doc.archivo)}
                                        sx={actionBtnSx}
                                        title="Ver archivo"
                                      >
                                        <img
                                          src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa17.png?alt=media&token=aae19df1-ae52-45f4-8653-042af6b5a59b"
                                          alt="Ícono Ver Archivo"
                                          style={{ height: "24px" }}
                                        />
                                      </Button>
                                    )}
                                  </TableCell>
                                  <TableCell align="center" sx={bodyCellSx}>
                                    <Button
                                      variant="contained"
                                      color="warning"
                                      onClick={() => handleViewDetail(doc.id)}
                                      sx={actionBtnSx}
                                      title="Ver detalle"
                                    >
                                      <img
                                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa18.png?alt=media&token=8228c7ef-c92f-478c-995a-2104ea29f3d4"
                                        alt="Ícono Detalle"
                                        style={{ height: "24px" }}
                                      />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Diálogo de Detalle */}
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
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Fecha de Solicitud</TableCell>
                    <TableCell>
                      {documentDetail.fecha_solicitud
                        ? new Date(
                            documentDetail.fecha_solicitud + "T00:00:00"
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Fecha de Rendición</TableCell>
                    <TableCell>
                      {documentDetail.fecha_rendicion
                        ? new Date(
                            documentDetail.fecha_rendicion
                          ).toLocaleDateString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>RUC</TableCell>
                    <TableCell>{documentDetail.ruc || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Proveedor</TableCell>
                    <TableCell>{documentDetail.proveedor || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Tipo de Documento</TableCell>
                    <TableCell>{documentDetail.tipo_documento || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Serie</TableCell>
                    <TableCell>{documentDetail.serie || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Correlativo</TableCell>
                    <TableCell>{documentDetail.correlativo || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Sub Total</TableCell>
                    <TableCell>{documentDetail.sub_total || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>IGV</TableCell>
                    <TableCell>{documentDetail.igv || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                    <TableCell>{documentDetail.total || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Moneda</TableCell>
                    <TableCell>{documentDetail.moneda || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Tipo de Cambio</TableCell>
                    <TableCell>{documentDetail.tipo_cambio || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Rubro</TableCell>
                    <TableCell>{documentDetail.rubro || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Cuenta Contable</TableCell>
                    <TableCell>{documentDetail.cuenta_contable || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                    <TableCell>{documentDetail.estado || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Detalle</TableCell>
                    <TableCell>{documentDetail.detalle || "-"}</TableCell>
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

      {/* Diálogo para visualizar archivo */}
      <Dialog open={openFileDialog} onClose={handleCloseFileDialog} maxWidth="lg" fullWidth
        PaperProps={{ sx: { borderRadius: "16px", height: "90vh", m: 2 } }}>
        <DialogTitle sx={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #E2E6F0", pb: 1.5,
        }}>
          Archivo del Documento
          <Button onClick={handleCloseFileDialog} size="small"
            sx={{ minWidth: 32, color: "#5A6280", borderRadius: "8px", "&:hover": { background: "#F0F2F8" } }}>
            ✕
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {selectedFile && (
            selectedFile.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 2, background: "#F8F9FC", overflow: "auto" }}>
                <img src={selectedFile} alt="Archivo"
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              </Box>
            ) : (
              <iframe src={selectedFile} width="100%" style={{ flex: 1, border: "none", height: "100%" }}
                title="Archivo del Documento" />
            )
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default HistorialGastos;
