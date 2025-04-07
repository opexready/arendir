import React from 'react';
import { Navigate } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageCompanies from './ManageCompanies';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent
} from '@mui/material';

const AdminDashboard = ({ user }) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#F15A29",
          fontWeight: "bold",
          mb: 4
        }}
      >
        Panel Administrador
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <Box
              sx={{
                backgroundColor: "#2E3192",
                color: "white",
                p: 2,
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px"
              }}
            >
              <Typography variant="h6">Gestión de usuarios</Typography>
            </Box>
            <CardContent>
              <ManageUsers />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3 }}>
            <Box
              sx={{
                backgroundColor: "#2E3192",
                color: "white",
                p: 2,
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px"
              }}
            >
              <Typography variant="h6">Gestión de empresas</Typography>
            </Box>
            <CardContent>
              <ManageCompanies />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;