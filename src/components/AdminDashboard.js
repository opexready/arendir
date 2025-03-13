// src/components/AdminDashboard.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageCompanies from './ManageCompanies';

const AdminDashboard = ({ user }) => {
    // if (!user || user.role !== 'ADMIN') {
    //     return <Navigate to="/login" />;
    // }

    return (
        <div className="container mt-5">
            <h1 className="text-primary">Panel Administrador</h1>
            <div className="row">
                <div className="col-md-6">
                    <h2 className="text-white bg-primary p-2">Gestión de usuarios</h2>
                    <ManageUsers />
                </div>
                <div className="col-md-6">
                    <h2 className="text-white bg-primary p-2">Gestión de empresas</h2>
                    <ManageCompanies />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
