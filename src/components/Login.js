import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, TextField, Button, Box, Typography, Alert, AppBar, Toolbar } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/token', { email, password });
            localStorage.setItem('token', response.data.access_token);

            const userResponse = await api.get('/users/me/', {
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`
                }
            });
            const user = userResponse.data;
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'ADMINISTRACION') {
                navigate('/administracion2');
            } else if (user.role === 'APROBADOR') {
                navigate('/contador');
            } else if (user.role === 'COLABORADOR') {
                navigate('/colaborador');
            } else if (user.role === 'SOPORTE') {
                navigate('/soportePanel');
            } else if (user.role === 'ADMIN') {
                navigate('/admin-dashboard'); // Nueva ruta para el rol ADMIN
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('El usuario o la contraseña no son correctos.');
        }
    };

    return (
        <Container 
            maxWidth={false}
            sx={{ 
                backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/background1.png?alt=media&token=5feff8c0-6826-4cda-8851-05a2a9591c69)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: 0,
                margin: 0
            }}
        >
            <AppBar 
                position="fixed" 
                sx={{ 
                    background: 'linear-gradient(90deg, #7B1FA2, #F99E1E)',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {/* Puedes agregar texto o dejarlo vacío */}
                    </Typography>
                    <img 
                        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67" 
                        alt="Logo" 
                        style={{ height: '40px', cursor: 'pointer' }}  
                        onClick={() => navigate('/')}  
                    />
                </Toolbar>
            </AppBar>

            <Box sx={{ position: 'absolute', bottom: '20px', left: '20px' }}>
                <img 
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/iconoflecha.png?alt=media&token=a194d960-a3db-4b60-9436-6fea452060a0" 
                    alt="Icono de flecha" 
                    style={{ width: '40px', height: '40px' }}
                />
            </Box>
            <Box sx={{ width: '100%', maxWidth: '400px', mt: '80px', backgroundColor: 'rgba(255, 255, 255, 0.9)', p: 4, borderRadius: '8px' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#F15A29', fontWeight: 'bold', textAlign: 'center' }}>
                    BIENVENIDO
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        autoFocus
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
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
                            '&:hover': { backgroundColor: '#1F237A' }
                        }}
                    >
                        Iniciar Sesión
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
