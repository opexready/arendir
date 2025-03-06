// src/components/ManageUsers.js
import React, { useState, useEffect } from 'react';
import api from '../api';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        id_user:'',
        username: '',
        email: '',
        full_name: '',
        role: '',
        company_name: '',
        password: '',
        id_empresa:''
    });
    const [roles] = useState(['COLABORADOR', 'ADMINISTRACION', 'CONTADOR']);
    const [companies, setCompanies] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (userId) { // Solo si userId está disponible
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

                // Actualizar formData.id_empresa con el id de la primera compañía
                if (response.data.length > 0) {
                    setFormData({
                        ...formData,
                        id_empresa: response.data[0].id // Asignar el id de la compañía
                    });
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        // Obtener userId del localStorage
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        if (user && user.id) {
            setUserId(user.id);
            console.log("UserID obtenido:", user.id);
            setFormData({...formData, id_user: user.id}); 
        } else {
            console.error("UserID no encontrado en localStorage.");
        }

        fetchUsers(); // Llamar a fetchUsers después de obtener userId
        fetchCompanies();
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
            const responseData = await api.post('/api/users/', formData);

            // Create Rendicion
            try {
                const rendicionResponse = await api.post("/rendicion/", {
                    id_user: responseData.data.id,
                });
                console.log(
                    "Respuesta del servidor (rendicion):",
                    rendicionResponse.data
                );
            } catch (rendicionError) {
                console.error(
                    "Error al crear rendicion:",
                    rendicionError.response || rendicionError.message
                );
            }
            // Create Solicitud
            try {
                const solicitudResponse = await api.post("/solicitud/", {
                    id_user: responseData.data.id,
                });
                console.log(
                    "Respuesta del servidor (solicitud):",
                    solicitudResponse.data
                );
            } catch (solicitudError) {
                console.error(
                    "Error al crear solicitud:",
                    solicitudError.response || solicitudError.message
                );
            }
            setFormData({
                id_user: userId,
                username: '',
                email: '',
                full_name: '',
                role: '',
                company_name: '',
                id_empresa: companies.length > 0 ? companies[0].id : '' // Restablecer id_empresa
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
