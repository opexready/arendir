import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Backdrop } from '@mui/material';
import axios from 'axios';
import { baseURL, api } from '../api';
import './AnticiposGastosLocales.css'; // Mantén tu archivo CSS personalizado si es necesario

const AnticiposGastosLocales = () => {
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (`0${today.getMonth() + 1}`).slice(-2); // Asegura dos dígitos
        const day = (`0${today.getDate()}`).slice(-2); // Asegura dos dígitos
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        dni: '',
        responsable: '',
        gerencia: '',
        tipo_anticipo: 'GASTOS LOCALES',
        tipo_solicitud: 'ANTICIPO',
        empresa: 'innova',
        estado: 'POR APROBAR',
        area: '',
        ceco: '',
        motivo: '',
        moneda: 'PEN',
        banco: '',
        numero_cuenta: '',
        fecha_solicitud: getCurrentDate(),
        fecha_emision: getCurrentDate() // Agregamos este campo para la fecha de emisión
    });

    const [responseMessage, setResponseMessage] = useState(''); // Para manejar la respuesta de la API
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
    const [open, setOpen] = useState(false); // Estado para controlar el popup

    // Obtener la información del usuario autenticado al cargar el componente
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${baseURL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de que el token esté en localStorage
                    }
                });

                const userData = response.data;
                // Actualiza los datos del formulario con la información del usuario
                setFormData({
                    ...formData,
                    usuario: userData.email,
                    dni: userData.dni,
                    responsable: userData.full_name,
                    gerencia: userData.gerencia,
                    area: userData.area,
                    ceco: userData.ceco,
                    banco: userData.banco || '', // Si no hay banco, dejar vacío
                    numero_cuenta: userData.cuenta_bancaria || '',
                    fecha_solicitud: getCurrentDate(),
                    fecha_emision: getCurrentDate(), // Campo de fecha de emisión inicializado
                    tipo_solicitud: "ANTICIPO",
                    tipo_anticipo: "GASTOS LOCALES",
                    cuenta_contable: userData.cuenta_contable,
                });
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
            }
        };

        fetchUserData();
    }, []); // Se ejecuta solo una vez cuando el componente se monta

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Iniciar el loading

        try {
            const response = await axios.post(`${baseURL}/documentos/crear-con-pdf-local/`, formData);
            setResponseMessage('Anticipo creado correctamente.');
            setOpen(true); // Abre el popup cuando se crea el documento exitosamente
        } catch (error) {
            setResponseMessage('Error al crear el documento.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false); // Detener el loading
        }
    };

    const handleClose = () => {
        setOpen(false);
        window.history.back(); // Retrocede una vez en el historial del navegador
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 10 }}> {/* Ajustar el padding superior */}
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    align="center" 
                    gutterBottom 
                    sx={{ 
                        color: '#F15A29',  // Color naranja
                        fontWeight: 'bold',  // Texto en negrita
                        margin: '0',  // Elimina márgenes extra
                        fontSize: '1.5rem'  // Ajusta el tamaño de la fuente si es necesario
                    }}
                >
                    Anticipos Gastos Locales
                </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="motivo"
                            label="Breve Motivo"
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="moneda"
                            label="Moneda"
                            name="moneda"
                            select
                            SelectProps={{
                                native: true,
                            }}
                            value={formData.moneda}
                            onChange={handleChange}
                        >
                            <option value="PEN">PEN</option>
                            <option value="USD">USD</option>
                        </TextField>

                        {/* Campo Fecha Emisión */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="fecha_emision"
                            label="Fecha de Emisión"
                            name="fecha_emision"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={formData.fecha_emision}
                            onChange={handleChange}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="total"
                            label="Presupuesto"
                            name="total"
                            type="number"
                            value={formData.total}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                backgroundColor: '#2E3192',  // Color de fondo principal
                                '&:hover': { 
                                    backgroundColor: '#1F237A',  // Color de fondo en hover
                                },
                                color: 'white',  // Color del texto
                                '&:disabled': {
                                    backgroundColor: '#A5A5A5',  // Color de fondo cuando está deshabilitado
                                    color: '#E0E0E0',  // Color del texto cuando está deshabilitado
                                }
                            }}
                        >
                            {isLoading ? 'Enviando...' : 'Solicitar'}
                    </Button>

                    </Box>
                </CardContent>
            </Card>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Registro Exitoso</DialogTitle>
                <DialogContent>
                    <Typography>{responseMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Backdrop with CircularProgress for loading effect */}
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
};

export default AnticiposGastosLocales;
