import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import api, { baseURL } from "../api";

const Historial = () => {
  const [rendiciones, setRendiciones] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorialData = async () => {
      try {
        // Obtener datos del usuario desde la sesión
        // const userResponse = await axios.get(`${baseURL}/api/users/me`, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });
        const userResponse = await api.get('/api/users/me/');
        const userId = userResponse.data.id;

        // Realizar llamadas a las APIs
        const [rendicionesResponse, solicitudesResponse] = await Promise.all([
          axios.get(`${baseURL}/rendiciones/nombres`, {
            params: { id_user: userId, tipo: "RENDICION" },
          }),
          axios.get(`${baseURL}/api/solicitud/nombres`, {
            params: { id_user: userId },
          }),
        ]);

        // Actualizar estados con los datos obtenidos
        setRendiciones(rendicionesResponse.data);
        setSolicitudes(solicitudesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del historial:", error);
        setError(
          "Hubo un error al cargar los datos. Por favor, intenta nuevamente."
        );
        setLoading(false);
      }
    };

    fetchHistorialData();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: -20 }}>
      <Grid container spacing={4}>
        {/* Cuadro de Rendiciones */}
        <Grid item xs={12} md={6}>
          <Box sx={{ border: "1px solid #ccc", padding: 2, borderRadius: 2 }}>
            {/* Encabezado con imagen e icono */}
            <Box
              sx={{
                backgroundColor: "#1F4E79",
                color: "white",
                padding: 1,
                borderRadius: "4px 4px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1, // Espaciado entre imagen y texto
              }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa5.png?alt=media&token=b6854d9a-a91c-4930-bac3-150808ccabe5"
                alt="Ícono de gasto"
                style={{ height: "24px" }} // Ajusta el tamaño de la imagen
              />
              <Typography variant="h6" align="center">
                GASTO
              </Typography>
            </Box>

            {/* Lista de rendiciones */}
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography style={{ fontWeight: "bold" }}>
                      Gasto
                    </Typography>
                  }
                />
                <ListItemText
                  primary={
                    <Typography style={{ fontWeight: "bold" }}>
                      Estado
                    </Typography>
                  }
                />
              </ListItem>
              {rendiciones.map((rendicion, index) => (
                <ListItem key={index}>
                  <ListItemText primary={rendicion.nombre} />
                  <ListItemText primary={rendicion.estado} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>

        {/* Cuadro de Solicitudes */}
        <Grid item xs={12} md={6}>
          <Box sx={{ border: "1px solid #ccc", padding: 2, borderRadius: 2 }}>
            {/* Encabezado con imagen e ícono */}
            <Box
              sx={{
                backgroundColor: "#1F4E79",
                color: "white",
                padding: 1,
                borderRadius: "4px 4px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1, // Espaciado entre imagen y texto
              }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa6.png?alt=media&token=7ac20ab7-9ee1-45f3-ad4f-ab7d40c3e2cc"
                alt="Ícono de anticipo"
                style={{ height: "24px" }} // Ajusta el tamaño de la imagen
              />
              <Typography variant="h6" align="center">
                ANTICIPO
              </Typography>
            </Box>

            {/* Lista de solicitudes */}
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography style={{ fontWeight: "bold" }}>
                      Anticipo
                    </Typography>
                  }
                />
                <ListItemText
                  primary={
                    <Typography style={{ fontWeight: "bold" }}>
                      Estado
                    </Typography>
                  }
                />
              </ListItem>
              {solicitudes.map((solicitud, index) => (
                <ListItem key={index}>
                  <ListItemText primary={solicitud.nombre} />
                  <ListItemText primary={solicitud.estado} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Historial;
