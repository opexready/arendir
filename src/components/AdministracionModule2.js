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
  TableRow,
  Paper,
  Collapse,
  Modal,
  Box,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import { baseURL, getUsersByCompanyAndRole } from "../api";

const AdministracionModule2 = () => {
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

  const updateEstadoRendicion = async (id, tipo, nuevoEstado) => {
    try {
      if (tipo === "RENDICION") {
        await axios.put(`${baseURL}/rendicion/${id}`, { estado: nuevoEstado });
      } else if (tipo === "ANTICIPO") {
        await axios.put(`${baseURL}/api/solicitud/${id}`, { estado: nuevoEstado });
      }
      setRendiciones((prevRendiciones) =>
        prevRendiciones.map((rendicion) =>
          rendicion.rendicion.id === id
            ? {
                ...rendicion,
                rendicion: { ...rendicion.rendicion, estado: nuevoEstado },
              }
            : rendicion
        )
      );
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
        const userCompany = user ? user.company_name : null;
        console.log("user", user);

        const colaboradoresResponse = await axios.get(
          `${baseURL}/users/by-company-and-role/`,
          {
            params: {
              company_name: userCompany,
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
    try {
      const response = await axios.get(
        `${baseURL}/rendiciones-solicitudes/con-documentos/`,
        {
          params: {
            tipo: filtros.tipo_solicitud || undefined,
            estado: filtros.estado || "APROBADO",
            colaborador: filtros.colaborador || undefined,
            fecha_registro_from: filtros.fechaDesde || undefined,
            fecha_registro_to: filtros.fechaHasta || undefined,
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

  const headerStyle = {
    backgroundColor: "#2E3192",
    color: "white",
    fontWeight: "bold",
  };

  const rowStyle = {
    backgroundColor: "#f3f3f3",
  };

  const [openModal, setOpenModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user ? user.id : null;
        const username = user ? user.email : null;
        const userCompany = user ? user.company_name : null;
        console.log("user", user);

  const handleExportPDF = async (rendicionId) => {
    const params = {
      id_rendicion: rendicionId,
      id_usuario: userId,
    };
    try {
      const response = await axios.get(`${baseURL}/documentos/export/pdf`, {
        params,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rendicion_${rendicionId}_documento.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const handleExportExcel = async () => {
    const params = {
      company_name: empresa,
      estado: filtros.estado,
      username: filtros.colaborador,
      fecha_desde: filtros.fechaDesde || undefined, // Agregando filtro de fecha desde
      fecha_hasta: filtros.fechaHasta || undefined, // Agregando filtro de fecha hasta
    };
    try {
      const response = await axios.get(`${baseURL}/documentos/export/excel`, {
        params,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "documentos.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#F15A29", fontWeight: "bold", fontSize: "1.5rem" }}
      >
        Módulo de Administración - Rendiciones y Anticipos
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
                  <MenuItem key={colaborador.id} value={colaborador.email}>
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
                <MenuItem value="APROBADO">POR ABONAR</MenuItem>
                <MenuItem value="ABONADO">TERMINADO</MenuItem>
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
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              onClick={handleExportExcel}
              sx={{
                backgroundColor: "#F15A29",
                "&:hover": { backgroundColor: "#D14A23" },
                color: "white",
              }}
              fullWidth
            >
              Exportar Excel
            </Button>
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
                <TableCell style={headerStyle}>Código</TableCell>
                <TableCell style={headerStyle}>Colaborador</TableCell>
                <TableCell style={headerStyle}>Tipo</TableCell>
                <TableCell style={headerStyle}>Estado</TableCell>
                <TableCell style={headerStyle}>Fecha Registro</TableCell>
                <TableCell style={headerStyle}>Fecha Actualización</TableCell>
                <TableCell style={headerStyle}>Acciones</TableCell>
                <TableCell style={headerStyle}>PDF</TableCell>
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
                          <MenuItem value="APROBADO">POR ABONAR</MenuItem>
                          <MenuItem value="ABONADO">TERMINADO</MenuItem>
                          <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell>{rendicion.rendicion.fecha_registro}</TableCell>
                    <TableCell>
                      {rendicion.rendicion.fecha_actualizacion || "N/A"}
                    </TableCell>

                    <TableCell>
                      {rendicion.rendicion.tipo === "RENDICION" && (
                        <Button
                          variant="contained"
                          onClick={() => handleExportPDF(rendicion.rendicion.id)}
                          sx={{
                            backgroundColor: "#2E3192",
                            "&:hover": { backgroundColor: "#1F237A" },
                            color: "white",
                          }}
                        >
                          Exportar PDF
                        </Button>
                      )}
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
                              <TableCell style={headerStyle}>RUC</TableCell>
                              <TableCell style={headerStyle}>
                                Proveedor
                              </TableCell>
                              <TableCell style={headerStyle}>
                                Fecha Emisión
                              </TableCell>
                              <TableCell style={headerStyle}>Moneda</TableCell>
                              <TableCell style={headerStyle}>
                                Tipo Documento
                              </TableCell>
                              <TableCell style={headerStyle}>Total</TableCell>
                              <TableCell style={headerStyle}>Estado</TableCell>
                              <TableCell style={headerStyle}>Empresa</TableCell>
                              <TableCell style={headerStyle}>Archivo</TableCell>
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
                                      <MenuItem value="APROBADO">
                                        POR ABONAR
                                      </MenuItem>
                                      <MenuItem value="ABONADO">
                                      TERMINADO
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
                                    component="a"
                                    href={doc.archivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Ver Archivo
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
    </Container>
  );
};

export default AdministracionModule2;
