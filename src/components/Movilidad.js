import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Backdrop, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import esLocale from 'date-fns/locale/es';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './Movilidad.css';
import { baseURL } from '../api';  

// Datos Ubigeo (solo muestra Lima para simplificar, puedes expandirlo más tarde)
const ubigeoData = {
    "Lima": {
        "Lima": ["Miraflores", "Surco", "San Isidro"],
        "Canta": ["Obrajillo", "Huaros", "San Buenaventura"],
        "Huarochirí": ["Matucana", "San Mateo", "San Antonio"]
    },
    "Arequipa": {}, 
    "Cusco": {},
    "Piura": {},
    // Aquí puedes incluir todos los departamentos si es necesario
};

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
        cuenta_contable: 63112, // Se asigna un valor por defecto
        rubro: 'Movilidad',
        fecha_emision: null // Nuevo campo para la fecha de emisión
    });

    const [selectedDepartamento, setSelectedDepartamento] = useState('');
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedDistrito, setSelectedDistrito] = useState('');
    const [provincias, setProvincias] = useState([]);
    const [distritos, setDistritos] = useState([]);
    
    const [isOrigen, setIsOrigen] = useState(false); // Identifica si es origen o destino
    const [responseMessage, setResponseMessage] = useState(''); 
    const [isLoading, setIsLoading] = useState(false); 
    const [open, setOpen] = useState(false); 
    const [openUbigeoDialog, setOpenUbigeoDialog] = useState(false); 

    // Función que maneja cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // Manejador de cambios para el departamento seleccionado
    const handleDepartamentoChange = (e) => {
        const departamento = e.target.value;
        setSelectedDepartamento(departamento);
        setProvincias(Object.keys(ubigeoData[departamento]));
        setSelectedProvincia(''); // Resetea la provincia y el distrito al cambiar el departamento
        setSelectedDistrito('');
    };

    // Manejador de cambios para la provincia seleccionada
    const handleProvinciaChange = (e) => {
        const provincia = e.target.value;
        setSelectedProvincia(provincia);
        setDistritos(ubigeoData[selectedDepartamento][provincia]);
        setSelectedDistrito(''); // Resetea el distrito al cambiar la provincia
    };

    // Guardar el distrito seleccionado como origen o destino
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

    // Abrir el popup de selección de distrito para origen o destino
    const openUbigeoDialogForField = (isForOrigen) => {
        setIsOrigen(isForOrigen);
        setOpenUbigeoDialog(true);
    };

    // Cálculo automático del total basado en gastoDeducible y gastoNoDeducible
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
            correlativo: "00000000",
            dni: "111111111",
            gerencia: "Comercial"
        };

        console.log("Datos enviados: ", dataToSend); // Para depurar

        try {
            const response = await axios.post(`${baseURL}/generar-pdf-movilidad/`, dataToSend);
            setResponseMessage('Documento creado correctamente.');
            setOpen(true); 
        } catch (error) {
            setResponseMessage('Error al crear el documento.');
            console.error('Error al crear el documento:', error.response || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        window.history.back(); 
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 10 }}>
            <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" component="div" align="center" gutterBottom>
                        Gastos de Movilidad
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                        {/* Selector de Fecha de Emisión */}
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
                            <DatePicker
                                label="Fecha de Viaje"
                                value={formData.fecha_emision}
                                onChange={(newValue) => setFormData({ ...formData, fecha_emision: newValue })}
                                renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
                            />
                        </LocalizationProvider>

                        {/* Selector para Origen con popup */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Origen"
                            value={formData.origen}
                            onClick={() => openUbigeoDialogForField(true)}  // Abre el popup de selección de distrito
                            InputProps={{ readOnly: true }}  // Solo lectura
                        />

                        {/* Selector para Destino con popup */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Destino"
                            value={formData.destino}
                            onClick={() => openUbigeoDialogForField(false)}  // Abre el popup de selección de distrito
                            InputProps={{ readOnly: true }}  // Solo lectura
                        />

                        {/* Otros campos */}
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
                            InputProps={{
                                readOnly: true,
                            }}
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

            {/* Backdrop para mostrar el cargando */}
            <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer +
                            1 }}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
            
                        {/* Diálogo de confirmación después del envío */}
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
            
                        {/* Diálogo de selección de Ubigeo (Departamento -> Provincia -> Distrito) */}
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
            