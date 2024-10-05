import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Importa ThemeProvider y createTheme
import Navbar from './components/Navbar';
import Login from './components/Login';
import ContadorModule from './components/ContadorModule';
import AdministracionModule from './components/AdministracionModule';
import ColaboradorModule from './components/ColaboradorModule';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import RendicionGastos from './components/RendicionGastos';
import DatosRecibo from './components/DatosRecibo';
import Movilidad from './components/Movilidad'; // Importa el componente Movilidad
import AnticiposViajes from './components/AnticiposViajes'; // Importa el componente AnticiposViajes
import AnticiposGastosLocales from './components/AnticiposGastosLocales'; // Importa el nuevo componente AnticiposGastosLocales
//import './index.css';
import api from './api';

// Define el tema
const theme = createTheme({
    spacing: 8, // Configuración de espaciado por defecto
    // Puedes agregar otras configuraciones aquí
});

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me/');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    return (
        <ThemeProvider theme={theme}> {/* Envuelve la aplicación con ThemeProvider */}
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/contador" element={<ContadorModule user={user} />} />
                    <Route path="/administracion" element={<AdministracionModule user={user} />} />
                    <Route path="/colaborador/*" element={<ColaboradorModule user={user} />} />
                    <Route path="/colaborador/movilidad" element={<Movilidad />} /> {/* Añadida esta línea */}
                    <Route path="/colaborador/anticipos-viajes" element={<AnticiposViajes />} /> {/* Añadida esta línea */}
                    <Route path="/colaborador/anticipos-gastos-locales" element={<AnticiposGastosLocales />} /> {/* Añadida esta línea */}
                    <Route path="/admin" element={<AdminDashboard user={user} />} />
                    <Route path="/rendicion-gastos" element={<RendicionGastos />} />
                    <Route path="/datos-recibo" element={<DatosRecibo />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
