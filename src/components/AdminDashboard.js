// src/components/AdminDashboard.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageCompanies from './ManageCompanies';

const AdminDashboard = ({ user }) => {
    if (!user || user.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-primary">Admin Dashboard</h1>
            <div className="row">
                <div className="col-md-6">
                    <h2 className="text-white bg-primary p-2">Manage Users</h2>
                    <ManageUsers />
                </div>
                <div className="col-md-6">
                    <h2 className="text-white bg-primary p-2">Manage Companies</h2>
                    <ManageCompanies />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
