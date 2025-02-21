import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Grid, Typography, Box, FormControlLabel, Checkbox, Button, AppBar, Toolbar } from "@mui/material";
import { makeStyles } from "@mui/styles";

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
    position: "fixed",
    bottom: "20px",
    left: "20px",
    width: "40px",
    height: "40px",
    cursor: "pointer",
  },
}));

const AdminDashboard2 = () => {
  const [selectedRole, setSelectedRole] = useState(null); // Estado para almacenar el rol seleccionado
  const navigate = useNavigate();
  const classes = useStyles();

  const handleRoleChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedRole(name); // Solo actualiza el estado si el checkbox está seleccionado
    } else {
      setSelectedRole(null); // Desmarca si se deselecciona
    }
  };

  const handleRedirect = () => {
    if (selectedRole === "ADMINISTRACION") {
      navigate("/administracion2");
    } else if (selectedRole === "APROBADOR") {
      navigate("/contador");
    } else if (selectedRole === "COLABORADOR") {
      navigate("/colaborador");
    } else if (selectedRole === "ADMIN") {
      navigate("/admin");
    }
  };

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
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(90deg, #7B1FA2, #F99E1E)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {/* Puedes agregar texto o dejarlo vacío */}
          </Typography>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
            alt="Logo"
            style={{ height: "40px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </Toolbar>
      </AppBar>

      <Container className={classes.container}>
        <Container sx={{ marginTop: 20 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            style={{ color: "rgb(49, 39, 131)", fontWeight: "bold" }}
          >
            SELECCIONA UN ROL
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Box className={classes.card}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRole === "ADMINISTRACION"}
                      onChange={handleRoleChange}
                      name="ADMINISTRACION"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "white",
                        },
                        "& .MuiSvgIcon-root": {
                          border: "2px solid white",
                          borderRadius: "4px",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  }
                  label="Administración"
                  style={{ color: "#fff" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box className={classes.card}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRole === "APROBADOR"}
                      onChange={handleRoleChange}
                      name="APROBADOR"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "white",
                        },
                        "& .MuiSvgIcon-root": {
                          border: "2px solid white",
                          borderRadius: "4px",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  }
                  label="Aprobador"
                  style={{ color: "#fff" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box className={classes.card}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRole === "COLABORADOR"}
                      onChange={handleRoleChange}
                      name="COLABORADOR"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "white",
                        },
                        "& .MuiSvgIcon-root": {
                          border: "2px solid white",
                          borderRadius: "4px",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  }
                  label="Colaborador"
                  style={{ color: "#fff" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box className={classes.card}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRole === "ADMIN"}
                      onChange={handleRoleChange}
                      name="ADMIN"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "white",
                        },
                        "& .MuiSvgIcon-root": {
                          border: "2px solid white",
                          borderRadius: "4px",
                          backgroundColor: "transparent",
                        },
                      }}
                    />
                  }
                  label="Admin"
                  style={{ color: "#fff" }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleRedirect}
              sx={{
                backgroundColor: "#2E3192",
                "&:hover": { backgroundColor: "#1F237A" },
              }}
            >
              Continuar
            </Button>
          </Box>
        </Container>
      </Container>
      {/* Icono en la parte inferior izquierda */}
      <img
        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/iconoflecha.png?alt=media&token=a194d960-a3db-4b60-9436-6fea452060a0"
        alt="Icono de flecha"
        className={classes.floatingIcon}
        onClick={() => navigate("/")}
      />
    </Container>
  );
};

export default AdminDashboard2;