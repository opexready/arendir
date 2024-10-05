import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Drawer, List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FolderIcon from '@mui/icons-material/Folder';  // Icono para rendición
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import api from '../api';

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const Navbar = () => {
    const [user, setUser] = useState(null);  // Estado para almacenar el usuario autenticado
    const [drawerOpen, setDrawerOpen] = useState(true); // Controla si el drawer está abierto o cerrado
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

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Navbar superior */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#2E3192' }}>
                <Toolbar>
                    {user && user.role === 'COLABORADOR' && (
                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ marginLeft: '10px' }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: '10px' }}>
                        {"A Rendir"}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <IconButton edge="end" color="inherit" onClick={handleLogout}>
                                    <AccountCircle />
                                </IconButton>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Navbar lateral (Drawer), solo visible si el usuario es COLABORADOR */}
            {user && user.role === 'COLABORADOR' && ( // Solo renderizar el Drawer si el usuario es COLABORADOR
                <Drawer
                    sx={{
                        width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerOpen ? drawerWidth : collapsedDrawerWidth,
                            boxSizing: 'border-box',
                            transition: 'width 0.3s', // Animación de transición
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                    open={drawerOpen} // Asegura que se abra o cierre basado en el estado
                >
                    <Toolbar /> {/* Esto asegura que el Drawer no cubra el AppBar */}
                    <Divider />
                    <List>
                        <ListItem button component={Link} to="/colaborador/rendicion-gastos">
                            <ListItemIcon>
                                <FolderIcon />
                            </ListItemIcon>
                            {drawerOpen && <ListItemText primary="Gastos Generales" />}
                        </ListItem>
                        <ListItem button component={Link} to="/colaborador/historial">
                            <ListItemIcon>
                                <ListAltIcon />
                            </ListItemIcon>
                            {drawerOpen && <ListItemText primary="Historial" />}
                        </ListItem>
                        <ListItem button component={Link} to="/colaborador/anticipos-viajes">
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            {drawerOpen && <ListItemText primary="Anticipos Viajes" />}
                        </ListItem>
                        <ListItem button component={Link} to="/colaborador/anticipos-gastos-locales">
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            {drawerOpen && <ListItemText primary="Anticipos Gastos Locales" />}
                        </ListItem>
                    </List>
                </Drawer>
            )}

            {/* Espacio reservado para el contenido principal de la página */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    padding: 3,
                    marginTop: '64px', // Espacio para que no cubra el AppBar superior
                    marginLeft: user && user.role === 'COLABORADOR' ? (drawerOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px`) : 0, // Ajusta el margen dependiendo del estado del Drawer
                    transition: 'margin-left 0.3s', // Animación de transición
                }}
            >
                {/* Aquí va el contenido de las páginas */}
            </Box>
        </Box>
    );
};

export default Navbar;