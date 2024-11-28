import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import axios from 'axios';
import { baseURL } from '../api';


const Historial = () => {
  const [rendiciones, setRendiciones] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorialData = async () => {
      try {
        // Obtener datos del usuario desde la sesión
        const userResponse = await axios.get(`${baseURL}/users/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const userId = userResponse.data.id;

        // Realizar llamadas a las APIs
        const [rendicionesResponse, solicitudesResponse] = await Promise.all([
          axios.get(`${baseURL}/rendiciones/nombres`, {
            params: { user_id: userId, tipo: 'RENDICION' },
          }),
          axios.get(`${baseURL}/solicitud/nombres`, {
            params: { user_id: userId, tipo: 'ANTICIPO' },
          }),
        ]);

        // Actualizar estados con los datos obtenidos
        setRendiciones(rendicionesResponse.data);
        setSolicitudes(solicitudesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del historial:', error);
        setError('Hubo un error al cargar los datos. Por favor, intenta nuevamente.');
        setLoading(false);
      }
    };

    fetchHistorialData();
  }, []);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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
          <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
            <Typography
              variant="h6"
              align="center"
              sx={{ backgroundColor: '#1F4E79', color: 'white', padding: 1, borderRadius: '4px 4px 0 0' }}
            >
              GASTO
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Lista" secondary="Todos" />
                <ListItemText primary="Status" />
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
          <Box sx={{ border: '1px solid #ccc', padding: 2, borderRadius: 2 }}>
            <Typography
              variant="h6"
              align="center"
              sx={{ backgroundColor: '#1F4E79', color: 'white', padding: 1, borderRadius: '4px 4px 0 0' }}
            >
              ANTICIPO
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Lista" secondary="Todos" />
                <ListItemText primary="Status" />
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
