// src/components/Register.js
import React, { useState, useEffect } from 'react';
import api from '../api';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        role: '',
        company_name: '',
        password: ''
    });

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            const response = await api.get('/companies/');
            setCompanies(response.data);
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
            await api.post('/users/', formData);
            alert('User created successfully');
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required />
            <select name="role" onChange={handleChange} required>
                <option value="" disabled selected>Select Role</option>
                <option value="colaborador">Colaborador</option>
                <option value="admin">Admin</option>
                <option value="contador">Contador</option>
            </select>
            <select name="company_name" onChange={handleChange} required>
                <option value="" disabled selected>Select Company</option>
                {companies.map(company => (
                    <option key={company.id} value={company.name}>{company.name}</option>
                ))}
            </select>
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
