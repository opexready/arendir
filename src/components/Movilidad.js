import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Backdrop, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './Movilidad.css';
import { baseURL } from '../api';  
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ubigeoData from '../data/ubigeoData'; 

const Movilidad = () => {
    const [formData, setFormData] = useState({
        origen: '',
        destino: '',
        motivo: '',
        estado: 'POR APROBAR',
        tipo_gasto: 'LOCAL',
        gastoDeducible: '',
        gastoNoDeducible: '',
        empresa: 'innova',
        moneda: 'PEN',
        total: '',
        cuenta_contable: 63112,
        rubro: 'Movilidad',
        fecha_emision: null
    });

    const [selectedDepartamento, setSelectedDepartamento] = useState('');
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedDistrito, setSelectedDistrito] = useState('');
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const navigate = useNavigate();
    const [isOrigen, setIsOrigen] = useState(false);
    const [responseMessage, setResponseMessage] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [open, setOpen] = useState(false); 
    const [openUbigeoDialog, setOpenUbigeoDialog] = useState(false); 

    // Definir la función openUbigeoDialogForField
    const openUbigeoDialogForField = (isForOrigen) => {
        setIsOrigen(isForOrigen);
        setOpenUbigeoDialog(true);
    };

    // Función que maneja cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDepartamentoChange = (e) => {
        const departamento = e.target.value;
        setSelectedDepartamento(departamento);
        setProvincias(Object.keys(ubigeoData[departamento]));
        setSelectedProvincia('');
        setSelectedDistrito('');
    };

    const handleProvinciaChange = (e) => {
        const provincia = e.target.value;
        setSelectedProvincia(provincia);
        setDistritos(ubigeoData[selectedDepartamento][provincia]);
        setSelectedDistrito('');
    };

    const handleDistritoSelection = () => {
        if (isOrigen) {
            setFormData((prevState) => ({
                ...prevState,
                origen: selectedDistrito
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                destino: selectedDistrito
            }));
        }
        setOpenUbigeoDialog(false);
    };

    useEffect(() => {
        const deducible = parseFloat(formData.gastoDeducible) || 0;
        const noDeducible = parseFloat(formData.gastoNoDeducible) || 0;
        setFormData((prevState) => ({
            ...prevState,
            total: deducible + noDeducible
        }));
    }, [formData.gastoDeducible, formData.gastoNoDeducible]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const token = localStorage.getItem('token');
        const existingRendicion = localStorage.getItem("numero_rendicion");
        if (!existingRendicion) {
            console.error("Error: No se encontró numero_rendicion en localStorage.");
            alert("Error: No se encontró un número de rendición.");
            setIsLoading(false);
            return;
        }

        let loggedInUser = '';
        if (token) {
            const decodedToken = jwtDecode(token);
            loggedInUser = decodedToken.sub;
        } else {
            console.error("Token not found in localStorage.");
            setIsLoading(false);
            return;
        }

        const today = new Date().toISOString().split('T')[0]; 
        const dataToSend = { 
            ...formData, 
            fecha_solicitud: today,
            fecha_emision: formData.fecha_emision ? formData.fecha_emision.toISOString().split('T')[0] : today,
            usuario: loggedInUser,
            correlativo: "00000001",
            ruc:"00000000000",
            dni: "524169325",
            gerencia: "COMERCIAL",
            numero_rendicion: existingRendicion,
            tipo_cambio: 1,
            afecto: 0,
            inafecto: 0,
            igv: 0,
            serie: "----"

        };

        try {
            await axios.post(`${baseURL}/generar-pdf-movilidad/`, dataToSend);
            setResponseMessage('Documento creado correctamente.');
            setOpen(true); 
        } catch (error) {
            setResponseMessage('Error al crear el documento.');
            console.error('Error al crear el documento:', error.response || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // const handleClose = (registerAnother) => {
    //     setOpen(false);
    //     if (registerAnother) {
    //         console.log("Iniciando un nuevo gasto, manteniendo el número de rendición actual.");
    //     } else {
    //         console.log("Finalizando la rendición.");
    //         localStorage.removeItem("numero_rendicion");
    //         navigate('/colaborador');
    //     }
    // };

    const handleClose = async (registerAnother) => {
        setOpen(false);
    
        if (registerAnother) {
            try {
                // Obtén el user_id de la sesión
                const userString = localStorage.getItem('user');
                const user = userString ? JSON.parse(userString) : null;
                const userId = user ? user.id : null;
    
                if (userId) {
                    // Realiza la solicitud GET al endpoint para obtener la última rendición
                    const response = await api.get(`/rendicion/last`, { params: { user_id: userId } });
    
                    // Extrae y muestra el campo "nombre" en la consola
                    const { nombre } = response.data;
                    console.log("Nombre de la última rendición:", nombre);
    
                    // Redirigir a la página de rendición de gastos
                    navigate('/colaborador/rendicion-gastos');
                } else {
                    console.error('Error: Usuario no autenticado');
                    alert('Error: Usuario no autenticado');
                }
            } catch (error) {
                console.error('Error al obtener la última rendición:', error);
                alert('Error al obtener la última rendición. Intente nuevamente.');
            }
        } else {
            // Finalizar rendición y cerrar sesión
            localStorage.removeItem("numero_rendicion");
            navigate('/colaborador'); // Redirigir al dashboard principal
        }
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 10 }}>
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" component="div" align="center" gutterBottom>
                        Gastos de Movilidad
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
                            <DatePicker
                                label="Fecha de Viaje"
                                value={formData.fecha_emision}
                                onChange={(newValue) => setFormData({ ...formData, fecha_emision: newValue })}
                                renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                            />
                        </LocalizationProvider>

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Origen"
                            value={formData.origen}
                            onClick={() => openUbigeoDialogForField(true)}
                            InputProps={{ readOnly: true }}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Destino"
                            value={formData.destino}
                            onClick={() => openUbigeoDialogForField(false)}
                            InputProps={{ readOnly: true }}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Motivo"
                            name="motivo"
                            value={formData.motivo}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Gasto Deducible"
                            name="gastoDeducible"
                            type="number"
                            value={formData.gastoDeducible}
                            onChange={handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Total"
                            name="total"
                            type="number"
                            value={formData.total}
                            InputProps={{ readOnly: true }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            sx={{ marginTop: 4 }}
                        >
                            {isLoading ? 'Enviando...' : 'Solicitar'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Datos enviados con éxito</DialogTitle>
                <DialogContent>
                    <Typography>{responseMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose(true)} color="primary">
                        Adicionar Gasto
                    </Button>
                    <Button onClick={() => handleClose(false)} color="secondary">
                        Finalizar Rendición
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openUbigeoDialog} onClose={() => setOpenUbigeoDialog(false)}>
                <DialogTitle>Selecciona Ubicación</DialogTitle>
                <DialogContent>
                    <TextField
                        select
                        label="Departamento"
                        value={selectedDepartamento}
                        onChange={handleDepartamentoChange}
                        fullWidth
                        margin="normal"
                    >
                        {Object.keys(ubigeoData).map((dep) => (
                            <MenuItem key={dep} value={dep}>
                                {dep}
                            </MenuItem>
                        ))}
                    </TextField>

                    {provincias.length > 0 && (
                        <TextField
                            select
                            label="Provincia"
                            value={selectedProvincia}
                            onChange={handleProvinciaChange}
                            fullWidth
                            margin="normal"
                        >
                            {provincias.map((prov) => (
                                <MenuItem key={prov} value={prov}>
                                    {prov}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    {distritos.length > 0 && (
                        <TextField
                            select
                            label="Distrito"
                            value={selectedDistrito}
                            onChange={(e) => setSelectedDistrito(e.target.value)}
                            fullWidth
                            margin="normal"
                        >
                            {distritos.map((dist) => (
                                <MenuItem key={dist} value={dist}>
                                    {dist}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDistritoSelection} color="primary">
                        Guardar
                    </Button>
                    <Button onClick={() => setOpenUbigeoDialog(false)} color="secondary">
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Movilidad;