import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Typography, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";
import api from "../api";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(5),
    display: "flex",
    justifyContent: "center",
    position: "relative",
  },
  card: {
    boxShadow: theme.shadows[3],
    padding: theme.spacing(3),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer",
    backgroundColor: "#F15A29",
    color: "#fff",
    borderRadius: "10px",
    textAlign: "center",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  icon: {
    height: "150px",
    marginBottom: theme.spacing(1),
  },
  floatingIcon: {
    position: "fixed", // Cambiado a fixed para que siempre esté en la misma posición
    bottom: "20px",
    left: "20px",
    width: "40px",
    height: "40px",
    cursor: "pointer",
  },
}));

const ColaboradorModule = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me/");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const options = [
    {
      label: "Gastos",
      iconUrl:
        "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ICONO_GASTOS.png?alt=media&token=8dc8b602-bf9f-40ec-a5e9-e517d7e6c212",
      link: "/datos-recibo-table",
    },
    {
      label: "Anticipo",
      iconUrl:
        "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ICO_ANTICIPADO.png?alt=media&token=90d18d4e-a1c1-453c-8084-806f1a1dee28",
      link: "/anticipo-table",
    },
    {
      label: "Historial",
      iconUrl:
        "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ICONO_HISTORIAL.png?alt=media&token=927a3ebc-fd4b-4f65-9cec-f04be428dbc9",
      link: "/historial",
    },
    {
      label: "Detalle",
      iconUrl:
        "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ICONO_DETALLE.png?alt=media&token=086c4705-37f8-4c04-979f-9134eb3a9a97",
      link: "/detalle",
    },
  ];

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundImage:
          "url(https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/background1.png?alt=media&token=5feff8c0-6826-4cda-8851-05a2a9591c69)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: 0,
        margin: 0,
        marginTop: -20,
      }}
    >
      <Container className={classes.container}>
        <Container sx={{ marginBottom: 1 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ color: "rgb(49, 39, 131)", fontWeight: "bold" }}
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
                    // alt={option.label}
                    className={classes.icon}
                  />
                </Box>
                <div style={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    style={{ color: "rgb(49, 39, 131)", fontWeight: "bold" }}
                  >
                    {option.label}
                  </Typography>
                </div>
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
        onClick={() => navigate("/")} // Puedes cambiar la ruta o acción aquí
      />
    </Container>
  );
};

export default ColaboradorModule;
