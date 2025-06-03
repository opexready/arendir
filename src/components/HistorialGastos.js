import React, { useEffect, useState } from "react";
import {
  Container,
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

  const headerStyle = {
    backgroundColor: "#2E3192",
    color: "white",
    fontWeight: "bold",
  };

  const rowStyle = {
    backgroundColor: "#f3f3f3",
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: -20 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          color: "#F15A29",
          fontWeight: "bold",
          margin: "0",
          fontSize: "1.5rem",
        }}
      >
        Detalle de Rendiciones
      </Typography>

      {/* Filtros */}
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
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
              sx={{
                backgroundColor: "#2E3192",
                "&:hover": { backgroundColor: "#1F237A" },
                color: "white",
              }}
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
      <Paper elevation={3} sx={{ padding: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={headerStyle}>Nombre</TableCell>
                <TableCell style={headerStyle}>Tipo</TableCell>
                <TableCell style={headerStyle}>Estado</TableCell>
                <TableCell style={headerStyle}>Fecha Registro</TableCell>
                <TableCell style={headerStyle}>Fecha Actualización</TableCell>
                <TableCell style={headerStyle}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rendiciones.map((item) => {
                const data = item.rendicion || item.solicitud;
                return (
                  <React.Fragment key={data.id}>
                    <TableRow>
                      <TableCell>{data.nombre}</TableCell>
                      <TableCell>{data.tipo}</TableCell>
                      <TableCell>{data.estado}</TableCell>
                      <TableCell>{data.fecha_registro}</TableCell>
                      <TableCell>{data.fecha_actualizacion || "N/A"}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => toggleRendicion(data.id)}
                          size="small"
                          sx={{
                            backgroundColor: "#F15A29",
                            color: "white",
                            "&:hover": { backgroundColor: "#D14A23" },
                          }}
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
                              <TableRow>
                                <TableCell style={headerStyle}>RUC</TableCell>
                                <TableCell style={headerStyle}>Proveedor</TableCell>
                                <TableCell style={headerStyle}>Fecha Emisión</TableCell>
                                <TableCell style={headerStyle}>Moneda</TableCell>
                                <TableCell style={headerStyle}>Tipo Documento</TableCell>
                                <TableCell style={headerStyle}>Total</TableCell>
                                <TableCell style={headerStyle}>Ver Archivo</TableCell>
                                <TableCell style={headerStyle}>Detalle</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {item.documentos.map((doc) => (
                                <TableRow key={doc.id} style={rowStyle}>
                                  <TableCell>{doc.ruc}</TableCell>
                                  <TableCell>{doc.proveedor}</TableCell>
                                  <TableCell>{doc.fecha_emision}</TableCell>
                                  <TableCell>{doc.moneda}</TableCell>
                                  <TableCell>{doc.tipo_documento}</TableCell>
                                  <TableCell>{doc.total}</TableCell>
                                  <TableCell>
                                    {doc.archivo && (
                                      <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleViewFile(doc.archivo)}
                                        sx={{
                                          backgroundColor: "#2E3192",
                                          color: "white",
                                          "&:hover": { backgroundColor: "#1F237A" },
                                        }}
                                      >
                                        <img
                                          src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa17.png?alt=media&token=aae19df1-ae52-45f4-8653-042af6b5a59b"
                                          alt="Ícono Ver Archivo"
                                          style={{ height: "24px" }}
                                        />
                                      </Button>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="contained"
                                      color="warning"
                                      onClick={() => handleViewDetail(doc.id)}
                                      sx={{
                                        backgroundColor: "#F15A29",
                                        color: "white",
                                        "&:hover": { backgroundColor: "#D14A23" },
                                      }}
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
        <DialogTitle>Detalle del Documento</DialogTitle>
        <DialogContent>
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
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para visualizar archivo */}
      <Dialog open={openFileDialog} onClose={handleCloseFileDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Archivo del Documento</DialogTitle>
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
          <Button onClick={handleCloseFileDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistorialGastos;