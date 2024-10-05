import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import api from '../api';
import Home from './Home';
import RendicionGastos from './RendicionGastos';
import HistorialGastos from './HistorialGastos';
import DatosRecibo from './DatosRecibo';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(5),
    },
    card: {
        boxShadow: theme.shadows[3],
        padding: theme.spacing(3),
    },
}));

const ColaboradorModule = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/users/me/');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    if (!user) {
        return (
            <Container
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
                <Typography variant="h6" component="div" sx={{ marginLeft: 2 }}>
                    Loading...
                </Typography>
            </Container>
        );
    }

    return (
        <Container className={classes.container}>
            <Card className={classes.card}>
                <CardContent>
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/rendicion-gastos" element={<RendicionGastos />} />
                        <Route path="/historial" element={<HistorialGastos username={user.email} companyName={user.company_name} />} />
                        <Route path="/datos-recibo" element={<DatosRecibo />} />
                    </Routes>
                </CardContent>
            </Card>
        </Container>
    );
};

export default ColaboradorModule;
