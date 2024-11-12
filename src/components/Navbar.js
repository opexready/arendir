import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';  
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import api from '../api';

const Navbar = () => {
    const [user, setUser] = useState(null);  
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

            {user && user.role === 'COLABORADOR' && (
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
                        <ListItem button component={Link} to="/datos-recibo" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <ListAltIcon sx={{ color: '#8F3292' }} />
                            </ListItemIcon>
                            <ListItemText primary="Gastos" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/colaborador/anticipos-viajes" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <ListAltIcon sx={{ color: '#8F3292' }} />
                            </ListItemIcon>
                            <ListItemText primary="Anticipo" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/colaborador/historial" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <ListAltIcon sx={{ color: '#8F3292' }} />
                            </ListItemIcon>
                            <ListItemText primary="Historial" sx={{ color: '#2E3192', textAlign: 'center' }} />
                        </ListItem>
                        <ListItem button component={Link} to="/colaborador/historial" sx={{ justifyContent: 'center' }}>
                            <ListItemIcon>
                                <ListAltIcon sx={{ color: '#8F3292' }} />
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
