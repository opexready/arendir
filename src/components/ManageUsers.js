import React, { useState, useEffect } from 'react';
import api from '../api';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

const ManageUsers = () => {
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
                // Eliminamos la selección automática de la primera empresa
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
    }, [userId]);

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
        // if (!formData.password) {
        //     errors.password = 'Contraseña es requerida';
        //     isValid = false;
        // } else if (formData.password.length < 6) {
        //     errors.password = 'La contraseña debe tener al menos 6 caracteres';
        //     isValid = false;
        // }

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
        <div className="container mt-4">         
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="form-group mb-3">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                    />
                    {formErrors.username && <div className="invalid-feedback">{formErrors.username}</div>}
                </div>             
                <div className="form-group mb-3">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>              
                <div className="form-group mb-3">
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Nombre Completo"
                        value={formData.full_name}
                        onChange={handleChange}
                        className={`form-control ${formErrors.full_name ? 'is-invalid' : ''}`}
                    />
                    {formErrors.full_name && <div className="invalid-feedback">{formErrors.full_name}</div>}
                </div>               
                <div className="form-group mb-3">
                    <select 
                        name="role" 
                        onChange={handleChange} 
                        value={formData.role}
                        className={`form-control ${formErrors.role ? 'is-invalid' : ''}`}
                    >
                        <option value="" disabled>Seleccione el rol</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                    {formErrors.role && <div className="invalid-feedback">{formErrors.role}</div>}
                </div>             
                <div className="form-group mb-3">
                    {companies.length === 0 ? (
                        <div className="alert alert-warning">
                            Debe registrar primero una empresa
                        </div>
                    ) : (
                        <select 
                            name="company_name" 
                            onChange={handleChange} 
                            value={formData.company_name}
                            className={`form-control ${formErrors.company_name ? 'is-invalid' : ''}`}
                        >
                            <option value="" disabled selected>Seleccione la empresa</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.name}>{company.name}</option>
                            ))}
                        </select>
                    )}
                    {formErrors.company_name && <div className="invalid-feedback">{formErrors.company_name}</div>}
                </div>               
                {/* <div className="form-group mb-3">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                    />
                    {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                </div> */}
                
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading || companies.length === 0}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} style={{ color: 'white', marginRight: '10px' }} />
                            Procesando...
                        </>
                    ) : 'Crear usuario'}
                </button>
            </form>
            
            <h3>Lista de Usuarios</h3>
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Empresa</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.company_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
        </div>
    );
};

export default ManageUsers;