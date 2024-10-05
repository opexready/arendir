import React, { useEffect, useState } from 'react';
import { baseURL } from '../api';   
import {
    Container,
    Grid,
    Typography,
    Button,
    Select,
    MenuItem,
    FormControl,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
    Box
} from '@mui/material';
import api, { getUsersByCompanyAndRole, getNumerosRendicion } from '../api';
import lupaIcon from '../assets/lupa-icon.png'; // Asegúrate de tener esta imagen en la carpeta 'assets'

const ContadorModule = () => {
    const [user, setUser] = useState(null);
    const [documentos, setDocumentos] = useState([]);
    const [colaboradores, setColaboradores] = useState([]);
    const [numerosRendicion, setNumerosRendicion] = useState([]);
    const [empresa, setEmpresa] = useState('');
    const [selectedDocumento, setSelectedDocumento] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedColaborador, setSelectedColaborador] = useState(null);
    const [filtros, setFiltros] = useState({
        colaborador: '',
        estado: 'POR APROBAR',
        tipo_solicitud: 'GASTO',
        numero_rendicion: '',
        fechaDesde: '2024-08-01',
        fechaHasta: new Date().toISOString().split('T')[0],
        fechaEmisionDesde: '',
        fechaEmisionHasta: ''
    });

    // Obtener el usuario y establecer la empresa una sola vez
    useEffect(() => {
        const fetchUser = async () => {
            const response = await api.get('/users/me/');
            setUser(response.data);
            setEmpresa(response.data.company_name);
        };
        fetchUser();
    }, []);

    // Obtener colaboradores una vez que la empresa esté disponible
    useEffect(() => {
        const fetchColaboradores = async () => {
            if (empresa) {
                const colaboradores = await getUsersByCompanyAndRole(empresa, 'COLABORADOR');
                setColaboradores(colaboradores);
            }
        };
        fetchColaboradores();
    }, [empresa]);

    // Obtener números de rendición cuando se seleccione un colaborador
    // Obtener números de rendición cuando se seleccione un colaborador
useEffect(() => {
    const fetchNumerosRendicion = async () => {
        if (filtros.colaborador) {
            try {
                const response = await getNumerosRendicion(filtros.colaborador);
                console.log(response);  // para verificar la estructura de la respuesta
                if (response.data) {
                    setNumerosRendicion(response.data);  // Aquí tomamos la propiedad 'data' de la respuesta
                }
            } catch (error) {
                console.error('Error al obtener números de rendición:', error);
            }
        } else {
            setNumerosRendicion([]);
        }
    };
    fetchNumerosRendicion();
}, [filtros.colaborador]);


    // Función para buscar los documentos utilizando los filtros
    const fetchDocumentos = async () => {
        try {
            if (empresa) {
                const response = await api.get(`/documentos`, {
                    params: {
                        company_name: empresa,
                        estado: filtros.estado,
                        username: filtros.colaborador,
                        tipo_solicitud: filtros.tipo_solicitud,
                        numero_rendicion: filtros.numero_rendicion,
                        fecha_solicitud_from: filtros.fechaDesde,
                        fecha_solicitud_to: filtros.fechaHasta,
                        fecha_rendicion_from: filtros.fechaEmisionDesde,
                        fecha_rendicion_to: filtros.fechaEmisionHasta
                    },
                });
                setDocumentos(response.data);
            }
        } catch (error) {
            console.error('Error fetching documentos:', error);
        }
    };

    // Actualizar los filtros sin desencadenar la búsqueda
    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros({
            ...filtros,
            [name]: value,
        });

        if (name === 'colaborador' && value) {
            const colaborador = colaboradores.find(col => col.email === value);
            setSelectedColaborador(colaborador);
        } else if (name === 'colaborador' && !value) {
            setSelectedColaborador(null);
        }
    };

    // Ejecutar la búsqueda de documentos solo cuando se haga clic en "Filtrar"
    const handleFiltrarClick = () => {
        fetchDocumentos();
    };

    const handleEstadoChange = async (documentoId, nuevoEstado) => {
        if (!documentoId) {
            console.error('documentoId is undefined');
            return;
        }

        // Función para obtener la fecha actual
        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = (`0${today.getMonth() + 1}`).slice(-2); // Asegura dos dígitos
            const day = (`0${today.getDate()}`).slice(-2); // Asegura dos dígitos
            return `${year}-${month}-${day}`;
        };

        const fechaRendicion = getCurrentDate();  // Obtener la fecha actual

        try {
            await api.put(`/documentos/${documentoId}`, { 
                estado: nuevoEstado, 
                fecha_rendicion: fechaRendicion  // Enviar también la fecha de rendición
            });
            setDocumentos(prevDocumentos =>
                prevDocumentos.map(doc =>
                    doc.id === documentoId ? { ...doc, estado: nuevoEstado, fecha_rendicion: fechaRendicion } : doc
                )
            );
        } catch (error) {
            console.error('Error updating estado:', error);
        }
    };

    const handleViewFile = (documento) => {
        setSelectedDocumento(documento);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDocumento(null);
    };

    const handleDownloadFile = (fileLocation) => {
        const link = document.createElement('a');
        link.href = fileLocation; // Usa directamente la URL de Google Cloud Storage
        link.setAttribute('download', fileLocation.split('/').pop()); // Extraer el nombre del archivo para la descarga
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleExportExcel = async () => {
        const params = {
            company_name: empresa,
            estado: filtros.estado,
            username: filtros.colaborador,
        };
        const response = await api.get('/documentos/export/excel', { params, responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'documentos.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = async () => {
        const params = {
            company_name: empresa,
            estado: filtros.estado,
            username: filtros.colaborador,
            numero_rendicion: filtros.numero_rendicion
        };
        try {
            const response = await api.get('/documentos/export/pdf', { params, responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `documentos_${filtros.numero_rendicion}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error exporting PDF:", error);
        }
    };

    return (
        <Box sx={{ mt: 8, p: 2, bgcolor: 'white' }}>  {/* Ajuste de margen superior */}
            <Container maxWidth="lg">
                {selectedColaborador && (
                    <Box mb={4} p={2} sx={{ border: '1px solid #ccc', borderRadius: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body1"><strong>Nombre:</strong> {selectedColaborador.full_name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body1"><strong>Email:</strong> {selectedColaborador.email}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="body1"><strong>Compañía:</strong> {selectedColaborador.company_name}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ textAlign: 'right' }}>
                                <Button variant="contained" color="error" sx={{ mr: 2 }} onClick={handleExportPDF}>
                                    Exportar PDF
                                </Button>
                                <Button variant="contained" color="success" onClick={handleExportExcel}>
                                    Exportar Excel
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                        <Select
                                labelId="colaborador-label"
                                name="colaborador"
                                value={filtros.colaborador || ''}
                                onChange={handleFiltroChange}
                                fullWidth
                                displayEmpty
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em>Todos los Colaboradores</em>;
                                    }
                                    return colaboradores.find(colaborador => colaborador.email === selected)?.full_name || '';
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todos los Colaboradores</em> {/* Nueva opción para seleccionar todos */}
                                </MenuItem>
                                {colaboradores.map(colaborador => (
                                    <MenuItem key={colaborador.id} value={colaborador.email}>
                                        {colaborador.full_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        <Select
                                labelId="estado-label"
                                name="estado"
                                value={filtros.estado || ''}
                                onChange={handleFiltroChange}
                                fullWidth
                                displayEmpty
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em>Todos los Estados</em>;
                                    }
                                    return selected;
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todos los Estados</em>
                                </MenuItem>
                                <MenuItem value="POR APROBAR">POR APROBAR</MenuItem>
                                <MenuItem value="APROBADO">APROBADO</MenuItem>
    
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                        <Select
                                labelId="tipo_solicitud-label"
                                name="tipo_solicitud"
                                value={filtros.tipo_solicitud || ''}
                                onChange={handleFiltroChange}
                                fullWidth
                                displayEmpty
                                renderValue={(selected) => {
                                    if (selected === '') {
                                        return <em>Todos los Tipos de Solicitud</em>;
                                    }
                                    return selected;
                                }}
                            >
                                <MenuItem value="">
                                    <em>Todos los Tipos de Solicitud</em>
                                </MenuItem>
                                <MenuItem value="ANTICIPO">ANTICIPO</MenuItem>
                                <MenuItem value="GASTO">GASTO</MenuItem>
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Fecha Desde"
                                type="date"
                                name="fechaDesde"
                                value={filtros.fechaDesde || ''}
                                onChange={handleFiltroChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                label="Fecha Hasta"
                                type="date"
                                name="fechaHasta"
                                value={filtros.fechaHasta || ''}
                                onChange={handleFiltroChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                            />
                        </Grid>

                        {/* Mostrar el combo de numero_rendicion solo si hay un colaborador seleccionado */}
                        {filtros.colaborador && (
                            <Grid item xs={12} sm={3}>
                                <Select
                                    labelId="numero_rendicion-label"
                                    name="numero_rendicion"
                                    value={filtros.numero_rendicion || ''}
                                    onChange={handleFiltroChange}
                                    fullWidth
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected === '') {
                                            return <em>Seleccionar Número de Rendición</em>;
                                        }
                                        return selected;
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Seleccionar Número de Rendición</em>
                                    </MenuItem>
                                    {numerosRendicion.length > 0 && numerosRendicion.map((numero, index) => (
                                        <MenuItem key={index} value={numero}>
                                            {numero}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        )}
                    </Grid>
                </FormControl>

                <Button variant="contained" color="primary" onClick={handleFiltrarClick} sx={{ mb: 4 }}>
                    Filtrar
                </Button>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#007bff' }}> {/* Fondo de la cabecera */}
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Item</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>RUC</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo Doc</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cuenta Contable</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Serie</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Correlativo</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rubro</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Moneda</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo de Cambio</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Afecto</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>IGV</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Inafecto</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Archivo</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actualizar Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documentos.filter(doc =>
                                (!filtros.colaborador || (doc.usuario && doc.usuario.includes(filtros.colaborador))) &&
                                (!filtros.estado || (doc.estado && doc.estado.includes(filtros.estado)))
                            ).map((documento, index) => (
                                <TableRow key={documento.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{documento.fecha_emision}</TableCell>
                                    <TableCell>{documento.ruc}</TableCell>
                                    <TableCell>{documento.tipo_documento}</TableCell>
                                    <TableCell>{documento.cuenta_contable}</TableCell>
                                    <TableCell>{documento.serie}</TableCell>
                                    <TableCell>{documento.correlativo}</TableCell>
                                    <TableCell>{documento.rubro}</TableCell>
                                    <TableCell>{documento.moneda}</TableCell>
                                    <TableCell>{documento.tipo_cambio}</TableCell>
                                    <TableCell>{documento.afecto}</TableCell>
                                    <TableCell>{documento.igv}</TableCell>
                                    <TableCell>{documento.inafecto}</TableCell>
                                    <TableCell>{documento.total}</TableCell>
                                    <TableCell>
                                        {documento.archivo && (
                                            <Button variant="text" onClick={() => handleViewFile(documento)}>
                                                <img src={lupaIcon} alt="Ver Archivo" style={{ width: 24 }} />
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                    <FormControl fullWidth>
                                        <Select
                                            value={documento.estado || ""}
                                            onChange={(e) => handleEstadoChange(documento.id, e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>
                                                <em>Selecciona un Estado</em>
                                            </MenuItem>
                                            <MenuItem value="POR ABONAR">APROBADO</MenuItem>
                                            <MenuItem value="RECHAZADO">RECHAZADO</MenuItem>
                                            <MenuItem value="POR APROBAR">POR APROBAR</MenuItem> {/* Agregar todas las opciones posibles */}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={showModal} onClose={handleCloseModal}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4
                    }}>
                        <Typography variant="h6" component="h2">
                            Archivo del Documento
                        </Typography>
                        {selectedDocumento && selectedDocumento.archivo && (
                            <iframe
                             //    src={`http://localhost:8000/documentos/view/?file_location=${encodeURIComponent(selectedDocumento.archivo)}`}
                                src={`${baseURL}/documentos/view/?file_location=${encodeURIComponent(selectedDocumento.archivo)}`}
                                width="100%"
                                height="600px"
                                title="Archivo del Documento"
                                frameBorder="0"
                            />
                        )}
                        <Box sx={{ mt: 2, textAlign: 'right' }}>
                            <Button variant="contained" color="primary" onClick={() => handleDownloadFile(selectedDocumento.archivo)}>
                                Descargar Archivo
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Container>
        </Box>
    );
};

export default ContadorModule;
