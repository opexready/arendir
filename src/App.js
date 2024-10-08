import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ContadorModule from './components/ContadorModule';
import AdministracionModule from './components/AdministracionModule';
import ColaboradorModule from './components/ColaboradorModule';
import AdminDashboard from './components/AdminDashboard';
import RendicionGastos from './components/RendicionGastos';
import LandingPage from './components/LandingPage';
import DatosRecibo from './components/DatosRecibo';
import Movilidad from './components/Movilidad';
import AnticiposViajes from './components/AnticiposViajes';
import AnticiposGastosLocales from './components/AnticiposGastosLocales';
import api from './api';

// Define el tema
const theme = createTheme({
    spacing: 8,
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
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    {/* Sin Navbar */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />

                    {/* Con Navbar */}
                    <Route
                        path="*"
                        element={
                            <>
                                <Navbar />
                                <Routes>
                                    <Route path="/contador" element={<ContadorModule user={user} />} />
                                    <Route path="/administracion" element={<AdministracionModule user={user} />} />
                                    <Route path="/colaborador/*" element={<ColaboradorModule user={user} />} />
                                    <Route path="/colaborador/movilidad" element={<Movilidad />} />
                                    <Route path="/colaborador/anticipos-viajes" element={<AnticiposViajes />} />
                                    <Route path="/colaborador/anticipos-gastos-locales" element={<AnticiposGastosLocales />} />
                                    <Route path="/admin" element={<AdminDashboard user={user} />} />
                                    <Route path="/rendicion-gastos" element={<RendicionGastos />} />
                                    <Route path="/datos-recibo" element={<DatosRecibo />} />
                                </Routes>
                            </>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
