import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';

const ManageUsers = ({ refreshCompanies }) => {  
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        id_user: '',
        username: '',
        email: '',
        full_name: '',
        role: '',
        company_name: '',
        password: 'Xrosdh223i',
        id_empresa: ''
    });
    const [roles] = useState(['COLABORADOR', 'ADMINISTRACION', 'APROBADOR']);
    const [companies, setCompanies] = useState([]);
    const [userId, setUserId] = useState(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            if (userId) { 
                try {
                    const response = await api.get('/api/users/by-id-user/', {
                        params: {
                            id_user: userId 
                        }
                    });
                    setUsers(response.data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };

        const fetchCompanies = async () => {
            try {
                const response = await api.get(`/api/companies/user/${userId}`);
                setCompanies(response.data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        if (user && user.id) {
            setUserId(user.id);
            setFormData(prev => ({...prev, id_user: user.id})); 
        } else {
            console.error("UserID no encontrado en localStorage.");
        }
        fetchUsers(); 
        fetchCompanies();
    }, [userId, refreshCompanies]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'company_name') {
            const selectedCompany = companies.find(c => c.name === value);
            if (selectedCompany) {
                setSelectedCompanyId(selectedCompany.id);
                setFormData(prev => ({
                    ...prev,
                    company_name: value,
                    id_empresa: selectedCompany.id
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Limpiar errores al cambiar
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.username.trim()) {
            errors.username = 'Username es requerido';
            isValid = false;
        }
        if (!formData.email.trim()) {
            errors.email = 'Email es requerido';
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = 'Email no es válido';
            isValid = false;
        }
        if (!formData.full_name.trim()) {
            errors.full_name = 'Nombre completo es requerido';
            isValid = false;
        }
        if (!formData.role) {
            errors.role = 'Rol es requerido';
            isValid = false;
        }
        if (!formData.company_name) {
            errors.company_name = 'Empresa es requerida';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const resetForm = () => {
        setFormData({
            id_user: userId,
            username: '',
            email: '',
            full_name: '',
            role: '',
            company_name: '',
            password: 'Xrosdh223i',
            id_empresa: ''
        });
        setFormErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (companies.length === 0) {
            setSnackbar({
                open: true,
                message: 'Debe registrar primero una empresa',
                severity: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            const responseData = await api.post('/api/users/', formData);
            
            // Crear rendición
            try {
                await api.post("/api/rendicion/", {
                    id_user: responseData.data.id,
                    id_empresa: selectedCompanyId
                });
            } catch (rendicionError) {
                console.error("Error al crear rendicion:", rendicionError);
            }
            
            // Crear solicitud
            try {
                await api.post("/solicitud/", {
                    id_user: responseData.data.id,
                    id_empresa: selectedCompanyId
                });
            } catch (solicitudError) {
                console.error("Error al crear solicitud:", solicitudError);
            }

            // Actualizar lista de usuarios
            const response = await api.get('/api/users/by-id-user/', {
                params: { id_user: userId }
            });
            setUsers(response.data);

            // Limpiar formulario completamente
            resetForm();

            // Mostrar mensaje de éxito
            setSnackbar({
                open: true,
                message: 'Usuario registrado con éxito',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error creating user:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.detail || 'Error al registrar usuario',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Crear Nuevo Usuario
                    </Typography>
                    
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        error={!!formErrors.username}
                        helperText={formErrors.username}
                        sx={{ mb: 2 }}
                    />
                    
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        sx={{ mb: 2 }}
                    />
                    
                    <TextField
                        fullWidth
                        label="Nombre Completo"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        error={!!formErrors.full_name}
                        helperText={formErrors.full_name}
                        sx={{ mb: 2 }}
                    />
                    
                    <FormControl fullWidth sx={{ mb: 2 }} error={!!formErrors.role}>
                        <InputLabel>Rol</InputLabel>
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            label="Rol"
                            required
                        >
                            {roles.map(role => (
                                <MenuItem key={role} value={role}>{role}</MenuItem>
                            ))}
                        </Select>
                        {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
                    </FormControl>
                    
                    {companies.length === 0 ? (
                        <Typography color="error" sx={{ mb: 2 }}>
                            Debe registrar primero una empresa
                        </Typography>
                    ) : (
                        <FormControl fullWidth sx={{ mb: 2 }} error={!!formErrors.company_name}>
                            <InputLabel>Empresa</InputLabel>
                            <Select
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                label="Empresa"
                                required
                            >
                                {companies.map(company => (
                                    <MenuItem key={company.id} value={company.name}>{company.name}</MenuItem>
                                ))}
                            </Select>
                            {formErrors.company_name && <FormHelperText>{formErrors.company_name}</FormHelperText>}
                        </FormControl>
                    )}
                    
                    <Button 
                        type="submit" 
                        variant="contained"
                        disabled={loading || companies.length === 0}
                        sx={{
                            backgroundColor: "#F15A29",
                            "&:hover": { backgroundColor: "#F15A29" }
                        }}
                    >
                        {loading ? (
                            <>
                                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                                Procesando...
                            </>
                        ) : 'Crear usuario'}
                    </Button>
                </Box>

                <Typography variant="h6" gutterBottom>
                    Lista de Usuarios
                </Typography>
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><strong>Usuario</strong></TableCell>
                                <TableCell><strong>Nombre Completo</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Rol</strong></TableCell>
                                <TableCell><strong>Empresa</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.full_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.company_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </CardContent>
        </Card>
    );
};

export default ManageUsers;