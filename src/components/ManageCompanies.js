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
  IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ManageCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editCompany, setEditCompany] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            if (userId) {
                try {
                    const response = await api.get(`/api/companies/user/${userId}`);
                    setCompanies(response.data);
                } catch (error) {
                    console.error('Error fetching companies:', error);
                    setError('Aún no hay empresas registradas');
                }
            }
        };
        fetchCompanies();
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        if (user && user.id) {
            setUserId(user.id);
        } else {
            console.error("UserID no encontrado en localStorage.");
            setError('Usuario no autenticado');
        }
    }, [userId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                id_user: userId 
            };
            if (editCompany) {
                await api.put(`/api/companies/${editCompany.id}`, formData);
            } else {
                await api.post('/api/companies/', dataToSend);
            }
            setFormData({ name: '', description: '' });
            setEditCompany(null);
            
            const response = await api.get(`/api/companies/user/${userId}`);
            setCompanies(response.data);
        } catch (error) {
            console.error('Error saving company:', error);
            setError('Error al guardar la empresa');
        }
    };

    const handleEdit = (company) => {
        setEditCompany(company);
        setFormData({ name: company.name, description: company.description });
    };

    const handleDelete = async (companyId) => {
        try {
            await api.delete(`/api/companies/${companyId}`);
            const response = await api.get(`/api/companies/user/${userId}`);
            setCompanies(response.data);
        } catch (error) {
            console.error('Error deleting company:', error);
            setError('Error al eliminar la empresa');
        }
    };

    return (
        <Card variant="outlined">
            <CardContent>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        {editCompany ? 'Editar Empresa' : 'Crear Nueva Empresa'}
                    </Typography>
                    
                    <TextField
                        fullWidth
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    
                    <TextField
                        fullWidth
                        label="RUC"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />
                    
                    <Button 
                        type="submit" 
                        variant="contained"
                        sx={{
                            backgroundColor: "#F15A29",
                            "&:hover": { backgroundColor: "#F15A29" }
                        }}
                    >
                        {editCompany ? 'Actualizar' : 'Crear Empresa'}
                    </Button>
                    
                    {editCompany && (
                        <Button 
                            variant="outlined" 
                            onClick={() => {
                                setEditCompany(null);
                                setFormData({ name: '', description: '' });
                            }}
                            sx={{ ml: 2 }}
                        >
                            Cancelar
                        </Button>
                    )}
                </Box>

                <Typography variant="h6" gutterBottom>
                    Lista de Empresas
                </Typography>
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell><strong>Nombre</strong></TableCell>
                                <TableCell><strong>RUC</strong></TableCell>
                                <TableCell><strong>Acciones</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {companies.map(company => (
                                <TableRow key={company.id}>
                                    <TableCell>{company.name}</TableCell>
                                    <TableCell>{company.description}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            onClick={() => handleEdit(company)}
                                            sx={{ color: "#F15A29" }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton 
                                            onClick={() => handleDelete(company.id)}
                                            sx={{ color: "#F15A29" }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default ManageCompanies;