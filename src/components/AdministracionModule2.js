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
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import { baseURL, getUsersByCompanyAndRole } from "../api";
import { red } from "@mui/material/colors";

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
const excelBtnSx = {
  height: 56, borderRadius: "12px", textTransform: "none", gap: 1,
  fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, whiteSpace: "nowrap",
  boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
};
const pdfBtnSx = {
  minWidth: 140, height: 40, px: 2, borderRadius: "10px", textTransform: "none", gap: 1,
  fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13, whiteSpace: "nowrap",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
};

/* ── Buscador de comprobantes aprobados (lógica) ── */
const ESTADOS_APROBADOS = ["APROBADO", "ABONADO"];
const ETIQUETA_ESTADO = { APROBADO: "POR ABONAR", ABONADO: "TERMINADO", RECHAZADO: "RECHAZADO" };
const MAX_DETALLES = 150;

const soloDigitos = (v) => String(v ?? "").replace(/\D/g, "");

// "00012345" y "12345" son el mismo número
const normalizarCorrelativo = (v) => {
  const t = String(v ?? "").trim();
  return /^\d+$/.test(t) ? String(parseInt(t, 10)) : t.toUpperCase();
};

// "F001-00012345" → { serie: "F001", correlativo: "12345" }
const separarSerieNumero = (texto) => {
  const t = String(texto ?? "").trim().toUpperCase();
  if (!t) return { serie: "", correlativo: "" };
  const partes = t.split(/[-\s/]+/).filter(Boolean);
  if (partes.length === 1) {
    return /^\d+$/.test(partes[0])
      ? { serie: "", correlativo: normalizarCorrelativo(partes[0]) }
      : { serie: partes[0], correlativo: "" };
  }
  return { serie: partes[0], correlativo: normalizarCorrelativo(partes[1]) };
};

const coincideSerieNumero = (doc, buscada) => {
  if (buscada.serie && String(doc.serie ?? "").trim().toUpperCase() !== buscada.serie) return false;
  if (buscada.correlativo && normalizarCorrelativo(doc.correlativo ?? doc.numero) !== buscada.correlativo) return false;
  return true;
};

const textoSerieNumero = (doc) => {
  const serie = String(doc.serie ?? "").trim();
  const numero = String(doc.correlativo ?? doc.numero ?? "").trim();
  return serie && numero ? `${serie}-${numero}` : serie || numero || "—";
};

const buscarComprobantesAprobados = async ({ http, idEmpresa, ruc, serieNumero }) => {
  const rucLimpio = soloDigitos(ruc);
  const buscada = separarSerieNumero(serieNumero);
  if (!rucLimpio && !buscada.serie && !buscada.correlativo) {
    return { error: "Ingresa el RUC y/o la serie-número para buscar." };
  }
  if (rucLimpio && rucLimpio.length !== 11) {
    return { error: "El RUC debe tener 11 dígitos." };
  }

  // Rendiciones aprobadas (POR ABONAR) y ya abonadas (TERMINADO)
  const respuestas = await Promise.all(
    ESTADOS_APROBADOS.map((estado) =>
      http.get(`${baseURL}/api/rendiciones-solicitudes/con-documentos/`, {
        params: { estado, id_empresa: idEmpresa },
      })
    )
  );

  let candidatos = [];
  respuestas.forEach((r) =>
    (Array.isArray(r.data) ? r.data : []).forEach((item) =>
      (item.documentos || []).forEach((doc) =>
        candidatos.push({ doc, rendicion: item.rendicion || {} })
      )
    )
  );

  if (rucLimpio) {
    candidatos = candidatos.filter((c) => soloDigitos(c.doc.ruc) === rucLimpio);
  }

  if (buscada.serie || buscada.correlativo) {
    // Si la lista no trae serie/número, se consulta el detalle de cada comprobante
    const faltaDetalle = (c) =>
      c.doc.serie === undefined && c.doc.correlativo === undefined && c.doc.numero === undefined;
    const pendientes = candidatos.filter(faltaDetalle).length;
    if (pendientes > MAX_DETALLES) {
      return {
        error: `Hay ${pendientes} comprobantes por revisar. Ingresa también el RUC del proveedor para acotar la búsqueda.`,
      };
    }
    if (pendientes > 0) {
      candidatos = await Promise.all(
        candidatos.map(async (c) => {
          if (!faltaDetalle(c)) return c;
          try {
            const d = await http.get(`${baseURL}/documentos/${c.doc.id}`);
            return { ...c, doc: { ...d.data, ...c.doc } };
          } catch (e) {
            return c;
          }
        })
      );
    }
    candidatos = candidatos.filter((c) => coincideSerieNumero(c.doc, buscada));
  }

  return { resultados: candidatos };
};

const extensionDe = (url, tipoMime) => {
  const m = String(url).split("?")[0].match(/\.([a-zA-Z0-9]{2,5})$/);
  if (m) return m[1].toLowerCase();
  const mapa = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  return mapa[tipoMime] || "pdf";
};

// Descarga el archivo; si el navegador lo bloquea, lo abre en una pestaña nueva
const descargarComprobante = async (doc) => {
  const url = doc.archivo;
  if (!url) return;
  const base = `${doc.ruc || "comprobante"}_${textoSerieNumero(doc) !== "—" ? textoSerieNumero(doc) : doc.id}`
    .replace(/[^A-Za-z0-9_-]/g, "");
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const blob = await resp.blob();
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = `${base}.${extensionDe(url, blob.type)}`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(enlace.href);
  } catch (e) {
    window.open(url, "_blank", "noopener");
  }
};
/* ── fin del buscador ── */

const buscarBtnSx = {
  height: 44, borderRadius: "10px", textTransform: "none", fontFamily: FONT_DISPLAY,
  fontWeight: 600, fontSize: 14, color: "#1B3B6F", borderColor: "#1B3B6F",
  "&:hover": { backgroundColor: "#E6EEF8", borderColor: "#1B3B6F" },
};

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

  // Buscador de comprobantes aprobados
  const [buscarOpen, setBuscarOpen] = useState(false);
  const [busqueda, setBusqueda] = useState({ ruc: "", serieNumero: "" });
  const [buscando, setBuscando] = useState(false);
  const [resultadosBusqueda, setResultadosBusqueda] = useState(null);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const ejecutarBusqueda = async () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const idEmpresa = user ? user.id_empresa : null;
    setBuscando(true);
    setErrorBusqueda("");
    setResultadosBusqueda(null);
    try {
      const r = await buscarComprobantesAprobados({
        http: axios,
        idEmpresa,
        ruc: busqueda.ruc,
        serieNumero: busqueda.serieNumero,
      });
      if (r.error) setErrorBusqueda(r.error);
      else setResultadosBusqueda(r.resultados);
    } catch (error) {
      console.error("Error al buscar comprobantes:", error);
      setErrorBusqueda(
        error.response
          ? `El servidor respondió con un error (código ${error.response.status}). Avisa al equipo técnico.`
          : "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo."
      );
    } finally {
      setBuscando(false);
    }
  };

  const cerrarBusqueda = () => {
    setBuscarOpen(false);
    setBusqueda({ ruc: "", serieNumero: "" });
    setResultadosBusqueda(null);
    setErrorBusqueda("");
  };

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

  const rowStyle = {
    backgroundColor: "#F8F9FC",
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
        sx={titleSx}
      >
        Módulo de Administración - Rendiciones y Anticipos
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" startIcon={<SearchIcon />} onClick={() => setBuscarOpen(true)} sx={buscarBtnSx}>
          Buscar comprobante
        </Button>
      </Box>


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
                MenuProps={menuProps}
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
              sx={excelBtnSx}
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
                {/* <TableCell sx={headCellSx}>  <img
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a58.png?alt=media&token=c8cddc01-ab6c-4ec4-982c-a0657445fa97"
                        alt="Ícono Eliminar"
                        style={{ height: "24px", marginRight: "8px" }}
                      />Acciones</TableCell> */}
                <TableCell align="center" sx={headCellSx}></TableCell>
                <TableCell align="center" sx={headCellSx}></TableCell>
                {/* <TableCell sx={headCellSx}>  <img
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/a59.png?alt=media&token=d13ade7a-96cf-4b94-aa8a-e8e678ae531b"
                        alt="Ícono Eliminar"
                        style={{ height: "24px", marginRight: "8px" }}
                      />PDF</TableCell> */}
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
                          <MenuItem value="APROBADO">POR ABONAR</MenuItem>
                          <MenuItem value="ABONADO">TERMINADO</MenuItem>
                          <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell sx={bodyCellSx}>{rendicion.rendicion.fecha_registro}</TableCell>
                    <TableCell sx={bodyCellSx}>
                      {rendicion.rendicion.fecha_actualizacion || "N/A"}
                    </TableCell>

                    <TableCell align="center" sx={bodyCellSx}>
                      {rendicion.rendicion.tipo === "RENDICION" && (
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() =>
                            handleExportPDF(rendicion.rendicion.id)
                          }
                          sx={pdfBtnSx}
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
                      colSpan={8}
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
                                <TableCell sx={bodyCellSx}>{doc.empresa}</TableCell>
                                <TableCell align="center" sx={bodyCellSx}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleViewFile(doc.archivo)}
                                    sx={actionBtnSx} // Llama a la función en lugar de usar href
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

      {/* Ventana: buscar comprobante aprobado por RUC y serie-número */}
      <Dialog open={buscarOpen} onClose={cerrarBusqueda} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={dialogTitleSx}>Buscar comprobante aprobado</DialogTitle>
        <DialogContent sx={{ ...dialogContentSx, ...formFieldsSx, pt: "12px !important" }}>
          <Typography sx={{ fontFamily: FONT_BODY, fontSize: 14, color: "#5A6280", mb: 2.5 }}>
            Ingresa el RUC del proveedor y/o la serie-número del comprobante. Se busca entre las
            rendiciones aprobadas (POR ABONAR) y las ya abonadas (TERMINADO).
          </Typography>

          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="RUC del proveedor"
                value={busqueda.ruc}
                onChange={(e) => setBusqueda((p) => ({ ...p, ruc: soloDigitos(e.target.value) }))}
                onKeyDown={(e) => e.key === "Enter" && ejecutarBusqueda()}
                inputProps={{ maxLength: 11, inputMode: "numeric" }}
                helperText="11 dígitos"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Serie-Número"
                placeholder="F001-12345"
                value={busqueda.serieNumero}
                onChange={(e) => setBusqueda((p) => ({ ...p, serieNumero: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && ejecutarBusqueda()}
                helperText="Ejemplo: F001-12345"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={ejecutarBusqueda}
                disabled={buscando}
                startIcon={buscando ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
                sx={{ ...filterBtnSx, height: 56, "&.Mui-disabled": { backgroundColor: "#C9CEDD", color: "#fff" } }}
              >
                {buscando ? "Buscando…" : "Buscar"}
              </Button>
            </Grid>
          </Grid>

          {errorBusqueda && (
            <Typography sx={{ mt: 2, fontFamily: FONT_BODY, fontSize: 14, color: "#C62828" }}>
              {errorBusqueda}
            </Typography>
          )}

          {resultadosBusqueda !== null && resultadosBusqueda.length === 0 && (
            <Typography sx={{ mt: 3, fontFamily: FONT_BODY, fontSize: 14, color: "#5A6280" }}>
              No se encontró ningún comprobante aprobado con esos datos. Revisa el RUC y la
              serie-número, o confirma que la rendición ya fue aprobada.
            </Typography>
          )}

          {resultadosBusqueda !== null && resultadosBusqueda.length > 0 && (
            <>
              <Typography sx={{ mt: 3, mb: 1, fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14, color: "#1B3B6F" }}>
                {resultadosBusqueda.length} comprobante{resultadosBusqueda.length === 1 ? "" : "s"} encontrado{resultadosBusqueda.length === 1 ? "" : "s"}
              </Typography>
              <TableContainer sx={{ maxHeight: 420, border: "1px solid #E2E6F0", borderRadius: "12px" }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {["Rendición", "Colaborador", "Estado", "RUC", "Proveedor", "Serie-Número", "Emisión"].map((t) => (
                        <TableCell key={t} align="left" sx={{ ...headCellSx, backgroundColor: "#1B3B6F" }}>{t}</TableCell>
                      ))}
                      <TableCell align="right" sx={{ ...headCellSx, backgroundColor: "#1B3B6F" }}>Total</TableCell>
                      <TableCell align="center" sx={{ ...headCellSx, backgroundColor: "#1B3B6F" }}>Archivo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resultadosBusqueda.map((c) => (
                      <TableRow key={c.doc.id} hover>
                        <TableCell sx={{ ...bodyCellSx, fontWeight: 700, color: "#1B3B6F" }}>{c.rendicion.nombre || "—"}</TableCell>
                        <TableCell sx={bodyCellSx}>{c.rendicion.nombre_usuario || "—"}</TableCell>
                        <TableCell sx={bodyCellSx}>{ETIQUETA_ESTADO[c.rendicion.estado] || c.rendicion.estado || "—"}</TableCell>
                        <TableCell sx={bodyCellSx}>{c.doc.ruc || "—"}</TableCell>
                        <TableCell sx={bodyCellSx}>{c.doc.proveedor || "—"}</TableCell>
                        <TableCell sx={bodyCellSx}>{textoSerieNumero(c.doc)}</TableCell>
                        <TableCell sx={bodyCellSx}>{c.doc.fecha_emision || "—"}</TableCell>
                        <TableCell align="right" sx={bodyCellSx}>{formatMoney(c.doc.total)}</TableCell>
                        <TableCell align="center" sx={bodyCellSx}>
                          <Box sx={{ display: "inline-flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              disabled={!c.doc.archivo}
                              onClick={() => handleViewFile(c.doc.archivo)}
                              sx={actionBtnSx}
                              title="Ver archivo"
                            >
                              <img
                                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa17.png?alt=media&token=aae19df1-ae52-45f4-8653-042af6b5a59b"
                                alt="Ver archivo"
                                style={{ height: "24px" }}
                              />
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={!c.doc.archivo}
                              onClick={() => descargarComprobante(c.doc)}
                              sx={actionBtnSx}
                              title="Descargar"
                            >
                              <DownloadIcon />
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </DialogContent>
        <DialogActions sx={dialogActionsSx}>
          <Button onClick={cerrarBusqueda} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdministracionModule2;
