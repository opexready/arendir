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

  const headerStyle = {
    backgroundColor: "#2E3192",
    color: "white",
    fontWeight: "bold",
  };

  const rowStyle = {
    backgroundColor: "#f3f3f3",
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#F15A29", fontWeight: "bold", fontSize: "1.5rem" }}
      >
        Módulo de Aprobador - Rendiciones y Anticipos
      </Typography>

      {/* Filtros */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Select
                name="colaborador"
                value={filtros.colaborador || ""}
                onChange={handleFiltroChange}
                displayEmpty
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
              sx={{
                backgroundColor: "#2E3192",
                "&:hover": { backgroundColor: "#1F237A" },
                color: "white",
              }}
              fullWidth
            >
              Filtrar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de Rendiciones */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={headerStyle}>
                  {" "}
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a46.png?alt=media&token=00936ed5-e266-4eca-853b-f869b3f2afeb"
                    alt="Ícono Eliminar"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Código
                </TableCell>
                <TableCell style={headerStyle}>
                  {" "}
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a47.png?alt=media&token=63738bbc-85ca-4d4e-8ea5-ffd95fa4e805"
                    alt="Ícono Eliminar"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Colaborador
                </TableCell>
                <TableCell style={headerStyle}>
                  {" "}
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a48.png?alt=media&token=af55ca0b-19f9-4c2d-8b32-b118eacff3f1"
                    alt="Ícono Eliminar"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Tipo
                </TableCell>
                <TableCell style={headerStyle}>
                  {" "}
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a49.png?alt=media&token=eb9186e8-2de5-4872-a22b-7121a463b16f"
                    alt="Ícono Eliminar"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Estado
                </TableCell>
                <TableCell style={headerStyle}>
                  {" "}
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a56.png?alt=media&token=0007a489-531b-41e3-862e-7025a3140f95"
                    alt="Ícono Eliminar"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Fecha Registro
                </TableCell>
                <TableCell style={headerStyle}>
                  {" "}
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a56.png?alt=media&token=0007a489-531b-41e3-862e-7025a3140f95"
                    alt="Ícono Eliminar"
                    style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                  />
                  Fecha Actualización
                </TableCell>
                <TableCell style={headerStyle}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rendiciones.map((rendicion) => (
                <React.Fragment key={rendicion.rendicion.id}>
                  <TableRow>
                    <TableCell>{rendicion.rendicion.nombre}</TableCell>
                    <TableCell>{rendicion.rendicion.nombre_usuario}</TableCell>
                    <TableCell>{rendicion.rendicion.tipo}</TableCell>
                    {/* <TableCell>{rendicion.rendicion.estado}</TableCell> */}
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
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

                    <TableCell>{rendicion.rendicion.fecha_registro}</TableCell>
                    <TableCell>
                      {rendicion.rendicion.fecha_actualizacion || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => toggleRendicion(rendicion.rendicion.id)}
                        size="small"
                        sx={{
                          backgroundColor: "#F15A29",
                          color: "white",
                          "&:hover": { backgroundColor: "#D14A23" },
                        }}
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
                      colSpan={6}
                      style={{ padding: 0, border: "none" }}
                    >
                      <Collapse
                        in={openRendiciones[rendicion.rendicion.id]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell style={headerStyle}>
                                {" "}
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                />
                                RUC
                              </TableCell>
                              <TableCell style={headerStyle}>
                                {" "}
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                />
                                Proveedor
                              </TableCell>
                              <TableCell style={headerStyle}>
                                {" "}
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                />
                                Fecha Emisión
                              </TableCell>
                              <TableCell style={headerStyle}>
                                {" "}
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                />
                                Moneda
                              </TableCell>
                              <TableCell style={headerStyle}>
                                {" "}
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                />
                                Tipo Documento
                              </TableCell>
                              <TableCell style={headerStyle}>
                                {" "}
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                />
                                Total
                              </TableCell>
                              <TableCell style={headerStyle}>
                                {" "}
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                />
                                Estado
                              </TableCell>
                              <TableCell style={headerStyle}>
                                {" "}
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                />
                                Empresa
                              </TableCell>
                              <TableCell style={headerStyle}>
                                {" "}
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa7.png?alt=media&token=7a3336ee-c877-4991-b3e1-48af36dd3ed7"
                                  alt="Ícono Eliminar"
                                  style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                />
                                Archivo
                              </TableCell>
                              <TableCell style={headerStyle}>
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa18.png?alt=media&token=8228c7ef-c92f-478c-995a-2104ea29f3d4"
                                  alt="Ícono Detalle"
                                  style={{ height: "24px" }}
                                />
                                Detalle
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rendicion.documentos.map((doc) => (
                              <TableRow key={doc.id} style={rowStyle}>
                                <TableCell>{doc.ruc}</TableCell>
                                <TableCell>{doc.proveedor}</TableCell>
                                <TableCell>{doc.fecha_emision}</TableCell>
                                <TableCell>{doc.moneda}</TableCell>
                                <TableCell>{doc.tipo_documento}</TableCell>
                                <TableCell>{doc.total}</TableCell>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <Select
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
                                <TableCell>{doc.empresa}</TableCell>
                                <TableCell>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleViewFile(doc.archivo)}
                                    // component="a"
                                    // href={doc.archivo}
                                    // target="_blank"
                                    // rel="noopener noreferrer"
                                  >
                                    <img
                                      src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa17.png?alt=media&token=aae19df1-ae52-45f4-8653-042af6b5a59b"
                                      alt="Ícono Número de Ítem"
                                      style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                                    />
                                  </Button>
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
      </Dialog>
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
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContadorModule;
