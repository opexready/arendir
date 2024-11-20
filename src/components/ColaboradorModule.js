import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import api from '../api';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(5),
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
    },
    card: {
        boxShadow: theme.shadows[3],
        padding: theme.spacing(3),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        backgroundColor: '#F15A29',
        color: '#fff',
        borderRadius: '10px',
        textAlign: 'center',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'scale(1.05)',
        },
    },
    icon: {
        height: '85px',
        marginBottom: theme.spacing(1),
    },
    floatingIcon: {
        position: 'fixed', // Cambiado a fixed para que siempre esté en la misma posición
        bottom: '20px',
        left: '20px',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
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

    const options = [
        {
            label: 'Gastos',
            iconUrl: 'https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/icono5.png?alt=media&token=47cf0d9b-4a7c-46d4-bbc4-4e171a40e6aa',
            link: '/datos-recibo',
        },
        {
            label: 'Anticipo',
            iconUrl: 'https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/icono6.png?alt=media&token=d7be0aa0-a6a7-4d74-8d81-a8d7aed9b0aa',
            link: '/anticipos-viajes',
        },
        {
            label: 'Historial',
            iconUrl: 'https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/icono7.png?alt=media&token=f5ed59d8-47f1-42e1-81ee-c76ded925dcf',
            link: '/historial',
        },
        {
            label: 'Detalle',
            iconUrl: 'https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/icono8.png?alt=media&token=3c73df86-cb00-41a6-9777-1627872a8adf',
            link: '/detalle',
        },
    ];

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
                margin: 0,
                marginTop: -20 
            }}
        >
            <Container className={classes.container}>
                <Container sx={{ marginBottom: 1 }}>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    style={{ color: 'rgb(49, 39, 131)', fontWeight: 'bold' }}
                >
                    SERVICIOS
                </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {options.map((option, index) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                key={index}
                                onClick={() => navigate(option.link)}
                            >
                                <Box className={classes.card}>
                                    <img
                                        src={option.iconUrl}
                                        alt={option.label}
                                        className={classes.icon}
                                    />
                                    <Typography
                                        variant="h6"
                                        style={{ color: 'rgb(49, 39, 131)' }}
                                    >
                                        {option.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Container>
            {/* Icono en la parte inferior izquierda */}
            <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/iconoflecha.png?alt=media&token=a194d960-a3db-4b60-9436-6fea452060a0"
                alt="Icono de flecha"
                className={classes.floatingIcon}
                onClick={() => navigate('/')} // Puedes cambiar la ruta o acción aquí
            />
        </Container>
    );
};

export default ColaboradorModule;
