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
  FormControl,
  InputLabel,
  Collapse,
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
  const [openRendiciones, setOpenRendiciones] = useState({}); // Controla las filas abiertas

  const fetchRendiciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseURL}/rendiciones/con-documentos/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tipo: tipo || undefined,
          estado: estado || undefined,
          fecha_registro_from: fechaRegistroFrom || undefined,
          fecha_registro_to: fechaRegistroTo || undefined,
        },
      });
      setRendiciones(response.data);
      setOpenRendiciones({}); // Reinicia el estado de las filas abiertas
    } catch (error) {
      console.error("Error al obtener las rendiciones:", error);
    }
  };

  useEffect(() => {
    fetchRendiciones(); // Cargar rendiciones al montar el componente
  }, []);

  const toggleRendicion = (id) => {
    setOpenRendiciones((prev) => ({
      ...prev,
      [id]: !prev[id], // Alterna el estado de apertura de la fila
    }));
  };

  const headerStyle = {
    backgroundColor: "#2E3192", // Color de fondo de la cabecera
    color: "white", // Texto blanco
    fontWeight: "bold", // Negrita
  };

  const rowStyle = {
    backgroundColor: "#f3f3f3", // Fondo claro para las filas
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
                <MenuItem value="CREADO">CREADO</MenuItem>
                <MenuItem value="PREPARADO">PREPARADO</MenuItem>
                <MenuItem value="POR APROBAR">POR APROBAR</MenuItem>
                <MenuItem value="APROBADO">APROBADO</MenuItem>
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
                        style={{ height: "24px" }} // Ajusta el tamaño de la imagen
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
              {rendiciones.map((rendicion) => (
                <React.Fragment key={rendicion.rendicion.id}>
                  <TableRow>
                    <TableCell>{rendicion.rendicion.nombre}</TableCell>
                    <TableCell>{rendicion.rendicion.tipo}</TableCell>
                    <TableCell>{rendicion.rendicion.estado}</TableCell>
                    <TableCell>{rendicion.rendicion.fecha_registro}</TableCell>
                    <TableCell>
                      {rendicion.rendicion.fecha_actualizacion || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          toggleRendicion(rendicion.rendicion.id)
                        }
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
                  {/* Subnivel de documentos */}
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

export default HistorialGastos;
