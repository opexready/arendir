import React from 'react';
import { Container, Grid, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const Historial = () => {
  // Datos en duro para la lista de rendiciones y solicitudes
  const rendiciones = [
    { nombre: 'Rendición 1', estado: 'Aprobado' },
    { nombre: 'Rendición 2', estado: 'Rechazado' },
    { nombre: 'Rendición 3', estado: 'Aprobado' }
  ];

  const solicitudes = [
    { nombre: 'Solicitud 1', estado: 'Aprobado' },
    { nombre: 'Solicitud 2', estado: 'Rechazado' },
    { nombre: 'Solicitud 3', estado: 'Aprobado' }
  ];

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
