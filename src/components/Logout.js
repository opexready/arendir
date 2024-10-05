// src/components/Logout.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Elimina el token de autenticación del almacenamiento local
        localStorage.removeItem('token');
        // Redirige al usuario a la página de inicio de sesión
        navigate('/login');
    }, [navigate]);

    return null; // No se renderiza nada
};

export default Logout;
