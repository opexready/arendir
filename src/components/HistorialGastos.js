import React, { useEffect, useState } from 'react';
import api from '../api';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Typography, Paper, TextField, Button, Grid } from '@mui/material';
import {jwtDecode} from 'jwt-decode'; // Para obtener el username del token

const HistorialGastos = () => {
    const [documentos, setDocumentos] = useState([]);
    const [estado, setEstado] = useState('');
    const [tipoSolicitud, setTipoSolicitud] = useState('');
    const [tipoAnticipo, setTipoAnticipo] = useState('');
    const [fechaSolicitudFrom, setFechaSolicitudFrom] = useState('');
    const [fechaSolicitudTo, setFechaSolicitudTo] = useState('');
    const [fechaRendicionFrom, setFechaRendicionFrom] = useState('');
    const [fechaRendicionTo, setFechaRendicionTo] = useState('');
    const [numeroRendicion, setNumeroRendicion] = useState('');
    const [loggedInUser, setLoggedInUser] = useState('');

    // Obtener el nombre de usuario del token almacenado en localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setLoggedInUser(decodedToken.sub); // Asumiendo que `sub` es el username
        }
    }, []);

    const fetchDocumentos = async () => {
        try {
            const response = await api.get('/documentos', {
                params: {
                    company_name: 'innova', // Suponiendo que se filtra por nombre de la empresa
                    estado: estado,
                    username: loggedInUser, // Usuario logueado
                    tipo_solicitud: tipoSolicitud,
                    tipo_anticipo: tipoAnticipo,
                    numero_rendicion: numeroRendicion,
                    fecha_solicitud_from: fechaSolicitudFrom,
                    fecha_solicitud_to: fechaSolicitudTo,
                    fecha_rendicion_from: fechaRendicionFrom,
                    fecha_rendicion_to: fechaRendicionTo,
                },
            });
            setDocumentos(response.data);
        } catch (error) {
            console.error('Error fetching documentos:', error);
        }
    };

    const handleSubmit = () => {
        fetchDocumentos();
    };

    // Estilo personalizado para la cabecera de la tabla
    const headerStyle = {
        backgroundColor: '#2E3192', // Color de fondo de la cabecera
        color: 'white', // Texto blanco
        fontWeight: 'bold', // Negrita
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Typography 
                variant="h4" 
                align="center" 
                gutterBottom 
                sx={{ 
                    color: '#F15A29',  // Color naranja
                    fontWeight: 'bold',  // Texto en negrita
                    margin: '0',  // Elimina márgenes extra
                    fontSize: '1.5rem'  // Ajusta el tamaño de la fuente si es necesario
                }}
            >
                Historial de Gastos
            </Typography>

            <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                <Grid container spacing={3}>
                    {/* Filtros */}
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="estado-label">Filtrar por Estado</InputLabel>
                            <Select
                                labelId="estado-label"
                                id="estadoSelect"
                                value={estado}
                                label="Filtrar por Estado"
                                onChange={(e) => setEstado(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="POR APROBAR">POR APROBAR</MenuItem>
                                <MenuItem value="POR ABONAR">APROBADO</MenuItem>
                                <MenuItem value="CERRADO">CERRADO</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="tipo-solicitud-label">Tipo de Solicitud</InputLabel>
                            <Select
                                labelId="tipo-solicitud-label"
                                id="tipoSolicitud"
                                value={tipoSolicitud}
                                label="Tipo de Solicitud"
                                onChange={(e) => setTipoSolicitud(e.target.value)}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="GASTO">GASTO</MenuItem>
                                <MenuItem value="ANTICIPO">ANTICIPO</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Fechas */}
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Fecha Solicitud Desde"
                            type="date"
                            fullWidth
                            value={fechaSolicitudFrom}
                            onChange={(e) => setFechaSolicitudFrom(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Fecha Solicitud Hasta"
                            type="date"
                            fullWidth
                            value={fechaSolicitudTo}
                            onChange={(e) => setFechaSolicitudTo(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {/* Botón para aplicar filtros */}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                            sx={{ 
                                backgroundColor: '#2E3192',  // Color de fondo
                                '&:hover': { backgroundColor: '#1F237A' },  // Color de fondo cuando se hace hover
                                color: 'white',  // Color del texto
                                marginTop: 2 
                            }}
                        >
                            Aplicar Filtros
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla de resultados */}
            <Paper elevation={3} sx={{ padding: 3 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" style={headerStyle}>RUC</TableCell>
                                <TableCell align="center" style={headerStyle}>Proveedor</TableCell>
                                <TableCell align="center" style={headerStyle}>Fecha Emisión</TableCell>
                                <TableCell align="center" style={headerStyle}>Moneda</TableCell>
                                <TableCell align="center" style={headerStyle}>Tipo Documento</TableCell>
                                <TableCell align="center" style={headerStyle}>Serie</TableCell>
                                <TableCell align="center" style={headerStyle}>Correlativo</TableCell>
                                <TableCell align="center" style={headerStyle}>Tipo Gasto</TableCell>
                                <TableCell align="center" style={headerStyle}>Sub Total</TableCell>
                                <TableCell align="center" style={headerStyle}>IGV</TableCell>
                                <TableCell align="center" style={headerStyle}>No Gravadas</TableCell>
                                <TableCell align="center" style={headerStyle}>Importe Facturado</TableCell>
                                <TableCell align="center" style={headerStyle}>TC</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documentos.map((documento) => (
                                <TableRow key={documento.id}>
                                    <TableCell align="center">{documento.ruc}</TableCell>
                                    <TableCell align="center">{documento.proveedor}</TableCell>
                                    <TableCell align="center">{documento.fecha_emision}</TableCell>
                                    <TableCell align="center">{documento.moneda}</TableCell>
                                    <TableCell align="center">{documento.tipo_documento}</TableCell>
                                    <TableCell align="center">{documento.serie}</TableCell>
                                    <TableCell align="center">{documento.correlativo}</TableCell>
                                    <TableCell align="center">{documento.tipo_gasto}</TableCell>
                                    <TableCell align="center">{documento.sub_total}</TableCell>
                                    <TableCell align="center">{documento.igv}</TableCell>
                                    <TableCell align="center">{documento.no_gravadas}</TableCell>
                                    <TableCell align="center">{documento.importe_facturado}</TableCell>
                                    <TableCell align="center">{documento.tc}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};

export default HistorialGastos;
