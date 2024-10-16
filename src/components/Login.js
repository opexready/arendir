import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Container, TextField, Button, Box, Typography, Alert } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Llamada a la API para obtener el token
            const response = await api.post('/token', { email, password });
            localStorage.setItem('token', response.data.access_token);  // Guardamos el token en el localStorage

            // Llamada a la API para obtener los datos del usuario
            const userResponse = await api.get('/users/me/', {
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`  // Incluimos el token en los headers
                }
            });
            const user = userResponse.data;

            // Guardar el usuario en el localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Redirigir según el rol del usuario
            if (user.role === 'ADMINISTRACION') {
                navigate('/administracion');
            } else if (user.role === 'APROBADOR') {
                navigate('/contador');
            } else if (user.role === 'COLABORADOR') {
                navigate('/colaborador');
            }
        } catch (error) {
            console.error('Login failed', error);
            setError('El usuario o la contraseña no son correctos.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: '80px', textAlign: 'center' }}>  
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#F15A29', fontWeight: 'bold' }}>
                    Bienvenido
                </Typography>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
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
                    color="primary"
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
        </Container>
    );
};

export default Login;
