import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Importa useLocation
import { AppBar, Toolbar, Typography, Button, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import api from '../api';

const Navbar = () => {
    const [user, setUser] = useState(null);  
    const navigate = useNavigate();
    const location = useLocation(); // Obtén la ubicación actual

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userResponse = await api.get('/users/me/');
                    setUser(userResponse.data);
                } 
            } catch (error) {
                console.error('Failed to fetch user', error);
                localStorage.removeItem('token'); 
                navigate('/login'); 
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');  
        setUser(null);  
        navigate('/login');  
    };

    // Verifica si la ruta actual es "/colaborador/*"
    const isColaboradorPage = location.pathname.startsWith('/colaborador');

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1, 
                    background: 'linear-gradient(90deg, #7B1FA2, #F99E1E)'  
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: '10px' }}>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <img 
                                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67" 
                                    alt="Logo" 
                                    style={{ height: '40px', cursor: 'pointer' }}  
                                    onClick={handleLogout}  
                                />
                            </>
                        ) : (
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Renderiza la barra de opciones solo si no estás en la página de colaborador */}
            {user && user.role === 'COLABORADOR' && !isColaboradorPage && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        paddingY: 1,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
                        marginTop: '64px' 
                    }}
                >
                    <List sx={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
                        {/* <ListItem button component={Link} to="/datos-recibo" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <img 
                                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/GASTOS.png?alt=media&token=e9261ba0-d22f-4d13-8ff0-213b23feb977" 
                                    alt="Gastos" 
                                    style={{ height: '24px', width: '24px' }} 
                                />
                            </ListItemIcon>
                            <ListItemText primary="Gastos" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem> */}
                        <ListItem 
                            button 
                            component={Link} 
                            to={{ pathname: '/datos-recibo-table', state: { reset: true } }} // Agregar `state`
                            sx={{ justifyContent: 'center' }}
                        >
                            <ListItemIcon>
                                <img 
                                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/GASTOS.png?alt=media&token=e9261ba0-d22f-4d13-8ff0-213b23feb977" 
                                    alt="Gastos" 
                                    style={{ height: '24px', width: '24px' }} 
                                />
                            </ListItemIcon>
                            <ListItemText primary="Gastos" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>

                        <ListItem button component={Link} to="/anticipo-table" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <img 
                                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ANTICIPOS.png?alt=media&token=f5f00653-d2c4-4919-8c33-7eb353f0cf7b" 
                                    alt="Anticipos" 
                                    style={{ height: '24px', width: '24px' }} 
                                />
                            </ListItemIcon>
                            <ListItemText primary="Anticipo" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/historial" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <img 
                                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/HISTORIAL.png?alt=media&token=fb09342e-37f7-4fc5-b268-2130731bd247" 
                                    alt="Historial" 
                                    style={{ height: '24px', width: '24px' }} 
                                />
                            </ListItemIcon>
                            <ListItemText primary="Historial" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/detalle" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <img 
                                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/DETALLE.png?alt=media&token=2de03c3c-1dc1-41f4-bbdf-b4c5e31857b7" 
                                    alt="Detalle" 
                                    style={{ height: '24px', width: '24px' }} 
                                />
                            </ListItemIcon>
                            <ListItemText primary="Detalle" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>
                    </List>
                </Box>
            )}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    padding: 3,
                    marginTop: user && user.role === 'COLABORADOR' ? '128px' : '64px', 
                }}
            >
            </Box>
        </Box>
    );
};

export default Navbar;
