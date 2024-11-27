import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, TextField, Button, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Backdrop } from '@mui/material';
import axios from 'axios';
import { baseURL, api } from '../api';
import './AnticiposGastosLocales.css'; // Mantén tu archivo CSS personalizado si es necesario
import { useNavigate } from "react-router-dom"; 
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
        fecha_emision: getCurrentDate(),
        numero_rendicion: '' // Añadimos el campo numero_rendicion
    });

    const [responseMessage, setResponseMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`${baseURL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const userData = userResponse.data;

                let numeroRendicion = "";
                try {
                  const rendicionResponse = await axios.get(`${baseURL}/rendicion/last`, {
                    params: { user_id: userData.id, tipo: "ANTICIPO" }, // Ajusta el parámetro `tipo` según sea necesario
                  });
                  numeroRendicion = rendicionResponse.data.nombre;
                } catch (error) {
                  console.error("Error al obtener el numero_rendicion:", error);
                }

                setFormData({
                    ...formData,
                    usuario: userData.email,
                    dni: userData.dni,
                    responsable: userData.full_name,
                    gerencia: userData.gerencia,
                    area: userData.area,
                    ceco: userData.ceco,
                    banco: userData.banco || '',
                    numero_cuenta: userData.cuenta_bancaria || '',
                    fecha_solicitud: getCurrentDate(),
                    fecha_emision: getCurrentDate(),
                    cuenta_contable: userData.cuenta_contable,
                    numero_rendicion: numeroRendicion, // Asignar el nombre del rendición al campo
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
        setIsLoading(true);

        try {
            const response = await axios.post(`${baseURL}/documentos/crear-con-pdf-local/`, formData);
            setResponseMessage('Anticipo creado correctamente.');
            setOpen(true);
        } catch (error) {
            setResponseMessage('Error al crear el documento.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        window.history.back();
    };
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false); 
    const handleAnticipoGastosLocales = () => {
        navigate("/anticipos-gastos-locales");
      };

    

    return (
        <Container sx={{ marginTop: -20}}>
               <Container sx={{ marginBottom: 2 }}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={() => setShowForm(true)} // Mostrar formulario
          >
            Anticipo Viajes
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ marginRight: 2 }}
            onClick={handleAnticipoGastosLocales}
          >
            Anticipo Gastos Locales
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ marginRight: 2 }}
            onClick={handleAnticipoGastosLocales}
          >
            Finalizar Anticipo
          </Button>
        </Box>
      </Container>
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: '#F15A29', fontWeight: 'bold', margin: '0', fontSize: '1.5rem' }}>
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
                                backgroundColor: '#2E3192',
                                '&:hover': {
                                    backgroundColor: '#1F237A',
                                },
                                color: 'white',
                                '&:disabled': {
                                    backgroundColor: '#A5A5A5',
                                    color: '#E0E0E0',
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

            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Container>
    );
};

export default AnticiposGastosLocales;
