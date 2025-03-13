// src/components/ManageCompanies.js
import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editCompany, setEditCompany] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            if (userId) {
                try {
                    const response = await api.get(`/api/companies/user/${userId}`);
                    setCompanies(response.data);
                } catch (error) {
                    console.error('Error fetching companies:', error);
                }
            }
        };
        fetchCompanies();
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        if (user && user.id) {
            setUserId(user.id);
            console.log("UserID obtenido:", user.id); // Imprimir el userId
        } else {
            console.error("UserID no encontrado en localStorage.");
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
                id_user: userId // Agregar userId al cuerpo de la petición
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
        }
    };

    const handleEdit = (company) => {
        setEditCompany(company);
        setFormData({ name: company.name, description: company.description });
    };

    const handleDelete = async (companyId) => {
        try {
            await api.delete(`/api/companies/${companyId}`);
            const response = await api.get('/api/companies/'); // Asegúrate de que es GET
            setCompanies(response.data);
        } catch (error) {
            console.error('Error deleting company:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="description"
                        placeholder="Descripción"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">{editCompany ? 'Update' : 'Crear Empresa'}</button>
            </form>
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map(company => (
                        <tr key={company.id}>
                            <td>{company.name}</td>
                            <td>{company.description}</td>
                            <td>
                                <button className="btn btn-warning" onClick={() => handleEdit(company)}>Modificar</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(company.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageCompanies;
