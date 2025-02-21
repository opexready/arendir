// src/components/ManageCompanies.js
import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [editCompany, setEditCompany] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get('/api/companies/'); // Asegúrate de que es GET
                setCompanies(response.data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editCompany) {
                await api.put(`/api/companies/${editCompany.id}`, formData);
            } else {
                await api.post('/api/companies/', formData);
            }
            setFormData({ name: '', description: '' });
            setEditCompany(null);
            const response = await api.get('/api/companies/'); // Asegúrate de que es GET
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
                        placeholder="Company Name"
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
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">{editCompany ? 'Update' : 'Create'}</button>
            </form>
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map(company => (
                        <tr key={company.id}>
                            <td>{company.name}</td>
                            <td>{company.description}</td>
                            <td>
                                <button className="btn btn-warning" onClick={() => handleEdit(company)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(company.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageCompanies;
