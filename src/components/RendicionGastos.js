import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const RendicionGastos = () => {
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    // Array con las opciones de categorías y sus descripciones
    const categoryOptions = [
        { value: '63111', label: 'Servicio transporte De carga' },
        { value: '63112', label: 'Movilidad' },
        { value: '6312', label: 'Correos' },
        { value: '6313', label: 'Alojamiento' },
        { value: '6314', label: 'Alimentación' },
        { value: '6315', label: 'Otros gastos de viaje' },
        { value: '6321', label: 'Asesoria - Administrativa' },
        { value: '6322', label: 'Asesoria - Legal y tributaria' },
        { value: '6323', label: 'Asesoria - Auditoría y contable' },
        { value: '6324', label: 'Asesoria - Mercadotecnia' },
        { value: '6325', label: 'Asesoria - Medioambiental' },
        { value: '6326', label: 'Asesoria - Investigación y desarrollo' },
        { value: '6327', label: 'Asesoria - Producción' },
        { value: '6329', label: 'Asesoria - Otros' },
        { value: '6343', label: 'Mantto y Reparacion - Inmuebles, maquinaria y equipo' },
        { value: '6344', label: 'Mantto y Reparacion - Intangibles' },
        { value: '6351', label: 'Alquileres - Terrenos' },
        { value: '6352', label: 'Alquileres - Edificaciones' },
        { value: '6353', label: 'Alquileres - Maquinarias y equipos de explotación' },
        { value: '6354', label: 'Alquileres - Equipo de transporte' },
        { value: '6356', label: 'Alquileres - Equipos diversos' },
        { value: '6361', label: 'Energía eléctrica' },
        { value: '6362', label: 'Gas' },
        { value: '6363', label: 'Agua' },
        { value: '6364', label: 'Teléfono' },
        { value: '6365', label: 'Internet' },
        { value: '6366', label: 'Radio' },
        { value: '6367', label: 'Cable' },
        { value: '6371', label: 'Publicidad' },
        { value: '6372', label: 'Publicaciones' },
        { value: '6373', label: 'Servicio de Relaciones públicas' },
        { value: '6391', label: 'Gastos bancarios' },
        { value: '6431', label: 'Impuesto predial' },
        { value: '6432', label: 'Arbitrios municipales y seguridad ciudadana' },
        { value: '6433', label: 'Impuesto al patrimonio vehicular' },
        { value: '6434', label: 'Licencia de funcionamiento' },
        { value: '6439', label: 'Otros' },
        { value: '653', label: 'Suscripciones' },
        { value: '654', label: 'Licencias y derechos de vigencia' },
        { value: '656', label: 'Suministros' },
        { value: '659', label: 'Otros gastos de gestión' },
        { value: '6591', label: 'Donaciones' },
        { value: '6592', label: 'Sanciones administrativas' },
    ];

    // Manejador para el cambio de categoría
    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    // Manejador del envío del formulario
    const handleSubmit = () => {
        if (category) {
            // Encuentra la categoría seleccionada
            const selectedOption = categoryOptions.find(option => option.value === category);

            if (selectedOption) {
                const selectedRubro = selectedOption.label;

                if (category === "63112") {
                    navigate('/colaborador/movilidad');
                } else {
                    // Navegar a datos-recibo pasando los valores de cuenta contable y rubro
                    navigate('/datos-recibo', {
                        state: { selectedCuentaContable: category, selectedRubro: selectedRubro }
                    });
                }
            }
        } else {
            alert('Por favor, seleccione una categoría antes de enviar');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}> {/* Elimina el contenedor extra */}
            <Card>
                <CardContent>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    align="center" 
                    gutterBottom 
                    sx={{ 
                        color: '#F15A29', // Color naranja
                        fontWeight: 'bold', // Texto en negrita
                        textAlign: 'center', // Centrado
                        margin: '0', // Elimina márgenes extra
                        fontSize: '1.5rem' // Ajusta el tamaño de la fuente si es necesario
                    }}
                >
                    Gastos Generales
                </Typography>

                    <FormControl fullWidth variant="outlined" sx={{ marginBottom: 3 }}>
                        <InputLabel id="category-label">Categoría</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            value={category}
                            onChange={handleCategoryChange}
                            label="Categoría"
                        >
                            <MenuItem value="" disabled>Seleccione una categoría</MenuItem>
                            {categoryOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: '#2E3192', // Establece el color de fondo personalizado
                            '&:hover': {
                                backgroundColor: '#1F237A', // Color al hacer hover
                            },
                        }}
                    >
                        Siguiente
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default RendicionGastos;
