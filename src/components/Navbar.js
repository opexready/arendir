import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FolderIcon from '@mui/icons-material/Folder';  // Icono para rendición
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import api from '../api';

const Navbar = () => {
    const [user, setUser] = useState(null);  // Estado para almacenar el usuario autenticado
    const navigate = useNavigate();

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
                localStorage.removeItem('token'); // Eliminar token si hay error
                navigate('/login'); // Redirigir al login si hay error
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');  // Remover token del localStorage al cerrar sesión
        setUser(null);  // Limpiar el usuario del estado
        navigate('/login');  // Redirigir al login
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* Navbar superior */}
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1, 
                    background: 'linear-gradient(90deg, #7B1FA2, #F99E1E)'  // Degradado de violeta a naranja
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: '10px' }}>
                        {/* {"A Rendir"} */}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <img 
                                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67" 
                                    alt="Logo" 
                                    style={{ height: '40px', cursor: 'pointer' }}  // Ajusta la altura de la imagen según sea necesario
                                    onClick={handleLogout}  // Añade funcionalidad de logout al hacer clic
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

            {/* Menú horizontal debajo del AppBar, visible solo si el usuario es COLABORADOR */}
            {user && user.role === 'COLABORADOR' && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        paddingY: 1,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Agrega sombra
                        marginTop: '64px' // Alinea debajo del AppBar
                    }}
                >
                    <List sx={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
                        <ListItem button component={Link} to="/datos-recibo" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <FolderIcon sx={{ color: '#8F3292' }} />
                            </ListItemIcon>
                            <ListItemText primary="Gastos" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/colaborador/historial" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <ListAltIcon sx={{ color: '#8F3292' }} />
                            </ListItemIcon>
                            <ListItemText primary="Historial" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/colaborador/anticipos-viajes" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <PersonIcon sx={{ color: '#8F3292' }} />
                            </ListItemIcon>
                            <ListItemText primary="Anticipo" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>
                        {/* <ListItem button component={Link} to="/colaborador/anticipos-gastos-locales" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <PersonIcon sx={{ color: '#8F3292' }} />
                            </ListItemIcon>
                            <ListItemText primary="Anticipos Gastos Locales" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem> */}
                    </List>
                </Box>
            )}

            {/* Espacio reservado para el contenido principal de la página */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    padding: 3,
                    marginTop: user && user.role === 'COLABORADOR' ? '128px' : '64px', // Ajusta el margen según si el menú está presente
                }}
            >
                {/* Aquí va el contenido de las páginas */}
            </Box>
        </Box>
    );
};

export default Navbar;
