import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Table,
  TableBody,
  TableCell,
  Box,
  TableContainer,
  TableHead,
  CircularProgress,  // Agregar esta importación
  DialogActions, 
  TableRow,
  Paper,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import { baseURL, getUsersByCompanyAndRole } from "../api";

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
const paperSx = {
  borderRadius: "12px", border: "1px solid #E2E6F0",
  boxShadow: "0 2px 16px rgba(27,59,111,0.08)",
};
const titleSx = {
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24, color: "#1B3B6F", mb: 3,
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
  "& .MuiSelect-select em": { fontStyle: "normal", color: "#5A6280" },
};
const filterBtnSx = {
  height: 48, borderRadius: "12px", textTransform: "none",
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: "#fff",
  backgroundColor: "#1B3B6F", boxShadow: "0 4px 12px rgba(27,59,111,0.3)",
  "&:hover": { backgroundColor: "#10233F" },
};
const toggleBtnSx = {
  backgroundColor: "#F15A29", color: "#fff", minWidth: 110, height: 40, borderRadius: "10px",
  textTransform: "none", fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13,
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)", "&:hover": { backgroundColor: "#D44A1C" },
};
const estadoSelectSx = {
  minWidth: 150, borderRadius: "10px", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
  color: "#2D3350", background: "#F8F9FC",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E6F0" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#1B3B6F" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1B3B6F", borderWidth: "1.5px" },
};
const menuProps = {
  PaperProps: {
    sx: { borderRadius: "10px", "& .MuiMenuItem-root": { fontFamily: FONT_BODY, fontSize: 14 }, "& em": { fontStyle: "normal" } },
  },
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

const ContadorModule = () => {
  const [rendiciones, setRendiciones] = useState([]);
  const [openRendiciones, setOpenRendiciones] = useState({});
  const [colaboradores, setColaboradores] = useState([]);
  const [empresa, setEmpresa] = useState("");
  const [filtros, setFiltros] = useState({
    colaborador: "",
    estado: "",
    tipo_solicitud: "",
    fechaDesde: "",
    fechaHasta: "",
  });

  const [documentDetail, setDocumentDetail] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

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

  const updateEstadoRendicion = async (id, tipo, nuevoEstado) => {
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const idAprobador = user ? user.id : null;
      const nomAprobador = user ? user.full_name : null;
      console.log("###############nomAprobador", nomAprobador);

      if (tipo === "RENDICION") {
        await axios.put(`${baseURL}/api/rendicion/${id}`, {
          estado: nuevoEstado,
          id_aprobador: idAprobador,
          nom_aprobador: nomAprobador,
        });
      } else if (tipo === "ANTICIPO") {
        await axios.put(`${baseURL}/api/solicitud/${id}`, {
          estado: nuevoEstado,
          id_aprobador: idAprobador,
          nom_aprobador: nomAprobador,
        });
      }
      // Aquí puedes agregar lógica para actualizar el estado local si es necesario
    } catch (error) {
      console.error("Error al actualizar el estado de la rendición:", error);
    }
  };

  // Obtener empresa y colaboradores al cargar el componente
  useEffect(() => {
    const fetchUserAndColaboradores = async () => {
      try {
        // Obtener el token desde localStorage o donde esté almacenado

        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user ? user.id : null;
        const username = user ? user.email : null;
        const idEmpresa = user ? user.id_empresa : null;
        console.log("user", user);

        const colaboradoresResponse = await axios.get(
          `${baseURL}/api/users/by-company-and-role/`,
          {
            params: {
              id_empresa: idEmpresa,
              role: "COLABORADOR",
            },
            // headers,
          }
        );
        console.log("Colaboradores:", colaboradoresResponse.data);
        setColaboradores(colaboradoresResponse.data);
      } catch (error) {
        console.error("Error al cargar empresa y colaboradores:", error);
      }
    };

    fetchUserAndColaboradores();
  }, []);

  const fetchRendiciones = async () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const idEmpresa = user ? user.id_empresa : null;

    try {
      const response = await axios.get(
        `${baseURL}/api/rendiciones-solicitudes/con-documentos/`,
        {
          params: {
            tipo_solicitud: filtros.tipo_solicitud || undefined,
            estado: filtros.estado || "POR APROBAR",
            id_user: filtros.colaborador || undefined,
            fecha_registro_from: filtros.fechaDesde || undefined,
            fecha_registro_to: filtros.fechaHasta || undefined,
            id_empresa: idEmpresa,
          },
        }
      );
      setRendiciones(response.data);
      setOpenRendiciones({});
    } catch (error) {
      console.error("Error al obtener las rendiciones:", error);
    }
  };

  const updateEstadoDocumento = async (documentoId, nuevoEstado) => {
    try {
      await axios.put(`${baseURL}/documentos/${documentoId}`, {
        estado: nuevoEstado,
      });
      setRendiciones((prevRendiciones) =>
        prevRendiciones.map((rendicion) => ({
          ...rendicion,
          documentos: rendicion.documentos.map((doc) =>
            doc.id === documentoId ? { ...doc, estado: nuevoEstado } : doc
          ),
        }))
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  useEffect(() => {
    fetchRendiciones();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({ ...prevFiltros, [name]: value }));
  };

  const handleFiltrarClick = () => {
    fetchRendiciones();
  };

  const toggleRendicion = (id) => {
    setOpenRendiciones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const handleViewFile = (fileUrl) => {
    setSelectedFile(fileUrl);
  };

  const rowStyle = {
    backgroundColor: "#F8F9FC",
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={titleSx}
      >
        Módulo de Aprobador - Rendiciones y Anticipos
      </Typography>

      {/* Filtros */}
      <Paper elevation={0} sx={{ ...paperSx, p: 3, mb: 3, ...formFieldsSx }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Select
                name="colaborador"
                value={filtros.colaborador || ""}
                onChange={handleFiltroChange}
                displayEmpty
                MenuProps={menuProps}
              >
                <MenuItem value="">
                  <em>Todos los Colaboradores</em>
                </MenuItem>
                {colaboradores.map((colaborador) => (
                  <MenuItem key={colaborador.id} value={colaborador.id}>
                    {colaborador.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Select
                name="estado"
                value={filtros.estado || ""}
                onChange={handleFiltroChange}
                displayEmpty
                MenuProps={menuProps}
              >
                <MenuItem value="">
                  <em>Todos los Estados</em>
                </MenuItem>
                <MenuItem value="POR APROBAR">POR APROBAR</MenuItem>
                <MenuItem value="APROBADO">APROBADO</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Select
                name="tipo_solicitud"
                value={filtros.tipo_solicitud || ""}
                onChange={handleFiltroChange}
                displayEmpty
                MenuProps={menuProps}
              >
                <MenuItem value="">
                  <em>Tipos los tipos</em>
                </MenuItem>
                <MenuItem value="RENDICION">RENDICIÓN</MenuItem>
                <MenuItem value="ANTICIPO">ANTICIPO</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Fecha Desde"
              type="date"
              name="fechaDesde"
              value={filtros.fechaDesde || ""}
              onChange={handleFiltroChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Fecha Hasta"
              type="date"
              name="fechaHasta"
              value={filtros.fechaHasta || ""}
              onChange={handleFiltroChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleFiltrarClick}
              sx={filterBtnSx}
              fullWidth
            >
              Filtrar
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
                <TableCell sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a46.png?alt=media&token=00936ed5-e266-4eca-853b-f869b3f2afeb"
                    alt="Ícono Eliminar"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Código
                </TableCell>
                <TableCell sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a47.png?alt=media&token=63738bbc-85ca-4d4e-8ea5-ffd95fa4e805"
                    alt="Ícono Eliminar"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Colaborador
                </TableCell>
                <TableCell sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a48.png?alt=media&token=af55ca0b-19f9-4c2d-8b32-b118eacff3f1"
                    alt="Ícono Eliminar"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Tipo
                </TableCell>
                <TableCell sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a49.png?alt=media&token=eb9186e8-2de5-4872-a22b-7121a463b16f"
                    alt="Ícono Eliminar"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Estado
                </TableCell>
                <TableCell sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a56.png?alt=media&token=0007a489-531b-41e3-862e-7025a3140f95"
                    alt="Ícono Eliminar"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Fecha Registro
                </TableCell>
                <TableCell sx={headCellSx}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a56.png?alt=media&token=0007a489-531b-41e3-862e-7025a3140f95"
                    alt="Ícono Eliminar"
                    style={{ height: "24px", marginRight: "8px" }}
                  />
                  Fecha Actualización
                </TableCell>
                <TableCell align="center" sx={headCellSx}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rendiciones.map((rendicion) => (
                <React.Fragment key={rendicion.rendicion.id}>
                  <TableRow hover>
                    <TableCell sx={bodyCellSx}>{rendicion.rendicion.nombre}</TableCell>
                    <TableCell sx={bodyCellSx}>{rendicion.rendicion.nombre_usuario}</TableCell>
                    <TableCell sx={bodyCellSx}>{rendicion.rendicion.tipo}</TableCell>
                    {/* <TableCell sx={bodyCellSx}>{rendicion.rendicion.estado}</TableCell> */}
                    <TableCell sx={bodyCellSx}>
                      <FormControl fullWidth>
                        <Select
                          size="small"
                          sx={estadoSelectSx}
                          MenuProps={menuProps}
                          value={rendicion.rendicion.estado}
                          onChange={(e) =>
                            updateEstadoRendicion(
                              rendicion.rendicion.id,
                              rendicion.rendicion.tipo,
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="POR APROBAR">POR APROBAR</MenuItem>
                          <MenuItem value="APROBADO">APROBADO</MenuItem>
                          <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell sx={bodyCellSx}>{rendicion.rendicion.fecha_registro}</TableCell>
                    <TableCell sx={bodyCellSx}>
                      {rendicion.rendicion.fecha_actualizacion || "N/A"}
                    </TableCell>
                    <TableCell align="center" sx={bodyCellSx}>
                      <Button
                        onClick={() => toggleRendicion(rendicion.rendicion.id)}
                        size="small"
                        sx={toggleBtnSx}
                      >
                        {openRendiciones[rendicion.rendicion.id] ? (
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
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      style={{ padding: 0, border: "none" }}
                    >
                      <Collapse
                        in={openRendiciones[rendicion.rendicion.id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#2C5599" }}>
                              <TableCell sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                RUC
                              </TableCell>
                              <TableCell sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                Proveedor
                              </TableCell>
                              <TableCell sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                Fecha Emisión
                              </TableCell>
                              <TableCell sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                Moneda
                              </TableCell>
                              <TableCell sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                Tipo Documento
                              </TableCell>
                              <TableCell align="right" sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                Total
                              </TableCell>
                              <TableCell sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                Estado
                              </TableCell>
                              <TableCell sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                Empresa
                              </TableCell>
                              <TableCell align="center" sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                Archivo
                              </TableCell>
                              <TableCell align="center" sx={headCellSx}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa18.png?alt=media&token=8228c7ef-c92f-478c-995a-2104ea29f3d4"
                                  alt="Ícono Detalle"
                                  style={{ height: "24px", marginRight: "8px" }}
                                />
                                Detalle
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rendicion.documentos.map((doc) => (
                              <TableRow key={doc.id} style={rowStyle}>
                                <TableCell sx={bodyCellSx}>{doc.ruc}</TableCell>
                                <TableCell sx={bodyCellSx}>{doc.proveedor}</TableCell>
                                <TableCell sx={bodyCellSx}>{doc.fecha_emision}</TableCell>
                                <TableCell sx={bodyCellSx}>{doc.moneda}</TableCell>
                                <TableCell sx={bodyCellSx}>{doc.tipo_documento}</TableCell>
                                <TableCell align="right" sx={bodyCellSx}>{formatMoney(doc.total)}</TableCell>
                                <TableCell sx={bodyCellSx}>
                                  <FormControl fullWidth>
                                    <Select
                                      size="small"
                                      sx={estadoSelectSx}
                                      MenuProps={menuProps}
                                      value={doc.estado}
                                      onChange={(e) =>
                                        updateEstadoDocumento(
                                          doc.id,
                                          e.target.value
                                        )
                                      }
                                      displayEmpty
                                    >
                                      <MenuItem value="POR APROBAR">
                                        POR APROBAR
                                      </MenuItem>
                                      <MenuItem value="APROBADO">
                                        APROBADO
                                      </MenuItem>
                                      <MenuItem value="RECHAZADO">
                                        RECHAZADO
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell sx={bodyCellSx}>{doc.empresa}</TableCell>
                                <TableCell align="center" sx={bodyCellSx}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleViewFile(doc.archivo)}
                                    sx={actionBtnSx}
                                    // component="a"
                                    // href={doc.archivo}
                                    // target="_blank"
                                    // rel="noopener noreferrer"
                                  >
                                    <img
                                      src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa17.png?alt=media&token=aae19df1-ae52-45f4-8653-042af6b5a59b"
                                      alt="Ícono Número de Ítem"
                                      style={{ height: "24px" }}
                                    />
                                  </Button>
                                </TableCell>
                                <TableCell align="center" sx={bodyCellSx}>
                                  <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => handleViewDetail(doc.id)}
                                    sx={actionBtnSx}
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={selectedFile !== null}
        onClose={() => setSelectedFile(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={dialogTitleSx}>Archivo del Documento</DialogTitle>
        <DialogContent sx={dialogContentSx}>
          {selectedFile && (
            selectedFile.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2, background: "#F8F9FC", minHeight: 300 }}>
                <img src={selectedFile} alt="Archivo"
                  style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              </Box>
            ) : (
              <iframe src={selectedFile} width="100%" height="600px"
                style={{ border: "none" }} title="Archivo del Documento" />
            )
          )}
        </DialogContent>
      </Dialog>
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
                      Fecha de Rendición
                    </TableCell>
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
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Tipo de Documento
                    </TableCell>
                    <TableCell>
                      {documentDetail.tipo_documento || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Serie</TableCell>
                    <TableCell>{documentDetail.serie || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Correlativo
                    </TableCell>
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
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Tipo de Cambio
                    </TableCell>
                    <TableCell>{documentDetail.tipo_cambio || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Rubro</TableCell>
                    <TableCell>{documentDetail.rubro || "-"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Cuenta Contable
                    </TableCell>
                    <TableCell>
                      {documentDetail.cuenta_contable || "-"}
                    </TableCell>
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
        <DialogActions sx={dialogActionsSx}>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContadorModule;
