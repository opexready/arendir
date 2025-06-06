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
  CircularProgress,  // Agregar esta importación
  DialogActions, 
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Modal,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import { baseURL, getUsersByCompanyAndRole } from "../api";
import { red } from "@mui/material/colors";

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

  // const updateEstadoRendicion = async (id, tipo, nuevoEstado) => {
  //   try {
  //     if (tipo === "RENDICION") {
  //       await axios.put(`${baseURL}/api/rendicion/${id}`, { estado: nuevoEstado });
  //     } else if (tipo === "ANTICIPO") {
  //       await axios.put(`${baseURL}/api/solicitud/${id}`, {
  //         estado: nuevoEstado,
  //       });
  //     }
  //     setRendiciones((prevRendiciones) =>
  //       prevRendiciones.map((rendicion) =>
  //         rendicion.rendicion.id === id
  //           ? {
  //               ...rendicion,
  //               rendicion: { ...rendicion.rendicion, estado: nuevoEstado },
  //             }
  //           : rendicion
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error al actualizar el estado de la rendición:", error);
  //   }
  // };

  const updateEstadoRendicion = async (id, tipo, nuevoEstado) => {
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const idAprobador = user ? user.id : null;
      const nomAprobador = user ? user.full_name : null; // Cambiado de email a full_name
      console.log("###############nomAprobador", nomAprobador);

      if (tipo === "RENDICION") {
        await axios.put(`${baseURL}/api/rendicion/${id}`, {
          estado: nuevoEstado,
          id_contador: idAprobador,
          nom_contador: nomAprobador,
        });
      } else if (tipo === "ANTICIPO") {
        await axios.put(`${baseURL}/api/solicitud/${id}`, {
          estado: nuevoEstado,
          id_contador: idAprobador,
          nom_contador: nomAprobador,
        });
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
            tipo: filtros.tipo_solicitud || undefined,
            estado: filtros.estado || "APROBADO",
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
  const userIdEmpresa = user ? user.id_empresa : null;
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
      id_empresa: userIdEmpresa,
      username: filtros.colaborador,
      fecha_desde: filtros.fechaDesde || undefined, // Agregando filtro de fecha desde
      fecha_hasta: filtros.fechaHasta || undefined, // Agregando filtro de fecha hasta
      tipo_solicitud: filtros.tipo_solicitud || undefined, // Añadir este parámetro
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

  const [selectedFile, setSelectedFile] = useState(null);
  const handleViewFile = (fileUrl) => {
    setSelectedFile(fileUrl);
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
                  <em>Tipos</em>
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
              color="success"
              onClick={handleExportExcel}
              sx={{
                marginRight: -3,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              fullWidth
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a59.png?alt=media&token=d13ade7a-96cf-4b94-aa8a-e8e678ae531b"
                alt="Ícono Eliminar"
                style={{ height: "24px" }} // Ajusta el tamaño de la imagen
              />
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
                {/* <TableCell style={headerStyle}>  <img
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a58.png?alt=media&token=c8cddc01-ab6c-4ec4-982c-a0657445fa97"
                        alt="Ícono Eliminar"
                        style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                      />Acciones</TableCell> */}
                <TableCell style={headerStyle}></TableCell>
                <TableCell style={headerStyle}></TableCell>
                {/* <TableCell style={headerStyle}>  <img
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a59.png?alt=media&token=d13ade7a-96cf-4b94-aa8a-e8e678ae531b"
                        alt="Ícono Eliminar"
                        style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                      />PDF</TableCell> */}
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
                          color="error"
                          onClick={() =>
                            handleExportPDF(rendicion.rendicion.id)
                          }
                          sx={{
                            marginRight: -3,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a59.png?alt=media&token=d13ade7a-96cf-4b94-aa8a-e8e678ae531b"
                            alt="Ícono Eliminar"
                            style={{ height: "24px" }} // Ajusta el tamaño de la imagen
                          />
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
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleViewFile(doc.archivo)} // Llama a la función en lugar de usar href
                                  >
                                    {/* <Button
                                    component="a"
                                    href={doc.archivo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  > */}
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

export default AdministracionModule2;
