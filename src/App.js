import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar';
import Login from './components/Login';
import AdminDashboard2 from './components/AdminDashboard2';
import PaymentMethodsPage from './components/PaymentMethodsPage';
import ContadorModule from './components/ContadorModule';
import AdministracionModule from './components/AdministracionModule';
import AdministracionModule2 from './components/AdministracionModule2';
import ColaboradorModule from './components/ColaboradorModule';
import AdminDashboard from './components/AdminDashboard';
import RendicionGastos from './components/RendicionGastos';
import LandingPage from './components/LandingPage';
import DatosRecibo from './components/DatosRecibo';
import DatosReciboTable from './components/DatosReciboTable';
import Movilidad from './components/Movilidad';
import AnticiposViajes from './components/AnticiposViajes';
import AnticipoTable from './components/AnticipoTable';
import AnticiposGastosLocales from './components/AnticiposGastosLocales';
import Historial from './components/Historial'; 
import SoportePanel from './components/SoportePanel'; 
import HistorialGastos from './components/HistorialGastos';// Importa tu nueva clase
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
                    <Route path="/admin-dashboard" element={<AdminDashboard2 />} />
                    <Route path="/payment-methods" element={<PaymentMethodsPage />} />
                    <Route path="/soportePanel" element={<SoportePanel />} />

                    {/* Con Navbar */}
                    <Route
                        path="*"
                        element={
                            <>
                                <Navbar />
                                <Routes>
                                    <Route path="/contador" element={<ContadorModule user={user} />} />
                                    <Route path="/administracion" element={<AdministracionModule user={user} />} />
                                    <Route path="/administracion2" element={<AdministracionModule2 user={user} />} />
                                    <Route path="/colaborador/*" element={<ColaboradorModule user={user} />} />
                                    <Route path="/movilidad" element={<Movilidad />} />
                                    <Route path="/anticipos-viajes" element={<AnticiposViajes />} />
                                    <Route path="/anticipo-table" element={<AnticipoTable />} />
                                    <Route path="/anticipos-gastos-locales" element={<AnticiposGastosLocales />} />
                                    <Route path="/admin" element={<AdminDashboard user={user} />} />
                                    <Route path="/rendicion-gastos" element={<RendicionGastos />} />
                                    <Route path="/datos-recibo" element={<DatosRecibo />} />
                                    <Route path="/datos-recibo-table" element={<DatosReciboTable />} />
                                    <Route path="/detalle" element={<HistorialGastos />} />
                                    <Route path="/historial" element={<Historial />} /> {/* Nueva ruta para Historial */}
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
