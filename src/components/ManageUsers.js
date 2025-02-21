// src/components/ManageUsers.js
import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        full_name: '',
        role: '',
        company_name: '',
        password: ''
    });
    const [roles] = useState(['colaborador', 'admin', 'contador']);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/api/users/'); // Asegúrate de que es GET
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();

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
            await api.post('/api/users/', formData);
            setFormData({
                username: '',
                email: '',
                full_name: '',
                role: '',
                company_name: '',
                password: ''
            });
            const response = await api.get('/api/users/'); // Asegúrate de que es GET
            setUsers(response.data);
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <select name="role" onChange={handleChange} className="form-control" required>
                        <option value="" disabled selected>Select Role</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <select name="company_name" onChange={handleChange} className="form-control" required>
                        <option value="" disabled selected>Select Company</option>
                        {companies.map(company => (
                            <option key={company.id} value={company.name}>{company.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create User</button>
            </form>
            <table className="table table-striped table-hover">
                <thead className="thead-dark">
                    <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Company</th>
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
        </div>
    );
};

export default ManageUsers;
