import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
    Container,
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    AppBar,
    Toolbar,
    Grid,
} from '@mui/material';

const SoportePanel = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyDescription, setCompanyDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            await api.post(
                '/users/',
                { username, email, password, role },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess('Usuario creado exitosamente.');
            setUsername('');
            setEmail('');
            setPassword('');
            setRole('');
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            setError(
                error.response?.data?.detail || 'Ocurrió un error al crear el usuario.'
            );
        }
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            await api.post(
                '/companies/',
                { name: companyName, description: companyDescription },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess('Compañía creada exitosamente.');
            setCompanyName('');
            setCompanyDescription('');
        } catch (error) {
            console.error('Error al crear la compañía:', error);
            setError(
                error.response?.data?.detail || 'Ocurrió un error al crear la compañía.'
            );
        }
    };

    const handleReadUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/users/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Usuarios:', response.data);
            setSuccess('Lista de usuarios obtenida. Ver consola.');
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            setError('Ocurrió un error al obtener usuarios.');
        }
    };

    const handleReadCompanies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/companies/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Compañías:', response.data);
            setSuccess('Lista de compañías obtenida. Ver consola.');
        } catch (error) {
            console.error('Error al obtener compañías:', error);
            setError('Ocurrió un error al obtener compañías.');
        }
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                backgroundImage:
                    'url(https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/background1.png?alt=media&token=5feff8c0-6826-4cda-8851-05a2a9591c69)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: 0,
                margin: 0,
            }}
        >
            <AppBar
                position="fixed"
                sx={{
                    background: 'linear-gradient(90deg, #7B1FA2, #F99E1E)',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Panel de Soporte
                    </Typography>
                    <Button
                        sx={{ color: '#FFF' }}
                        onClick={() => navigate('/')}
                    >
                        Salir
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    width: '90%',
                    maxWidth: '1200px',
                    mt: '80px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    p: 4,
                    borderRadius: '8px',
                }}
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{
                                color: '#F15A29',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                        >
                            Administración de Usuarios
                        </Typography>
                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                        <Box component="form" onSubmit={handleUserSubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Nombre de Usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Contraseña"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="role"
                                label="Rol"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#2E3192',
                                    '&:hover': { backgroundColor: '#1F237A' },
                                }}
                            >
                                Crear Usuario
                            </Button>
                        </Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleReadUsers}
                            sx={{ mt: 2 }}
                        >
                            Listar Usuarios
                        </Button>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{
                                color: '#F15A29',
                                fontWeight: 'bold',
                                textAlign: 'center',
                            }}
                        >
                            Administración de Compañías
                        </Typography>
                        <Box component="form" onSubmit={handleCompanySubmit}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="companyName"
                                label="Nombre de Compañía"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="companyDescription"
                                label="Descripción de Compañía"
                                value={companyDescription}
                                onChange={(e) =>
                                    setCompanyDescription(e.target.value)
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: '#2E3192',
                                    '&:hover': { backgroundColor: '#1F237A' },
                                }}
                            >
                                Crear Compañía
                            </Button>
                        </Box>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleReadCompanies}
                            sx={{ mt: 2 }}
                        >
                            Listar Compañías
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default SoportePanel;
