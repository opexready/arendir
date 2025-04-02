import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Importar el ícono de flecha
import WarningIcon from "@mui/icons-material/Warning";
import api from "../api";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await api.get("/api/users/me/");
          setUser(userResponse.data);
          if (userResponse.data.role !== "ADMIN") {
          const requiredFields = ['dni', 'cargo', 'banco', 'cuenta_bancaria'];
          const missing = requiredFields.filter(field => !userResponse.data[field]);
          if (missing.length > 0) {
            setMissingFields(missing);
            setOpenProfileDialog(true);
          }
        }
      }
      } catch (error) {
        console.error("Failed to fetch user", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setOpenProfileDialog(false);
  };

  const translateFieldName = (field) => {
    const translations = {
      'dni': 'DNI',
      'cargo': 'Cargo',
      'banco': 'Banco',
      'cuenta_bancaria': 'Cuenta Bancaria'      
    };
    return translations[field] || field;
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setOpenLogoutDialog(false);
    handleLogout();
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  const handleGoBack = () => {
    navigate(-1); // Navegar a la página anterior
  };

  const isColaboradorPage = location.pathname.startsWith("/colaborador");

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(90deg, #7B1FA2, #F99E1E)",
        }}
      >
        <Toolbar>
          {/* Botón de flecha para retroceder */}
          <IconButton
            color="inherit"
            onClick={handleGoBack}
            sx={{ marginRight: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: "10px" }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleProfileClick}
                  sx={{ marginRight: 2 }}
                >
                  <AccountCircleIcon />
                </IconButton>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
                  alt="Logo"
                  style={{ height: "40px", cursor: "pointer" }}
                  onClick={handleLogoutClick}
                />
              </>
            ) : (
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog 
        open={openProfileDialog} 
        onClose={() => setOpenProfileDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          <span>Datos requeridos faltantes</span>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Para continuar usando la plataforma, por favor complete los siguientes datos en su perfil:
          </Typography>
          <ul>
            {missingFields.map(field => (
              <li key={field}>
                <Typography variant="body1">
                  {translateFieldName(field)}
                </Typography>
              </li>
            ))}
          </ul>
          <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
            Será redirigido automáticamente a la página de perfil.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleProfileClick} 
            color="primary"
            variant="contained"
            sx={{ width: '100%' }}
          >
            Actualizar Perfil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para cerrar sesión */}
      <Dialog open={openLogoutDialog} onClose={handleLogoutCancel}>
        <DialogTitle>¿Está seguro que quiere cerrar sesión?</DialogTitle>
        <DialogContent>
          <Typography>Esta acción cerrará su sesión actual.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            No
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
            Sí
          </Button>
        </DialogActions>
      </Dialog>

      {/* Render options bar only if the user is logged in as "COLABORADOR" and not on a collaborator page */}
      {user && user.role === "COLABORADOR" && !isColaboradorPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            backgroundColor: "#f5f5f5",
            paddingY: 1,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: "64px",
            paddingLeft: 2,
          }}
        >
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ color: "#2E3192" }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  component={Link}
                  to="/datos-recibo-table"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/GASTOS.png?alt=media&token=e9261ba0-d22f-4d13-8ff0-213b23feb977"
                      alt="Gastos"
                      style={{ height: "24px", width: "24px" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Gastos" />
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/anticipo-table"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ANTICIPOS.png?alt=media&token=f5f00653-d2c4-4919-8c33-7eb353f0cf7b"
                      alt="Anticipos"
                      style={{ height: "24px", width: "24px" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Anticipo" />
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/historial"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/HISTORIAL.png?alt=media&token=fb09342e-37f7-4fc5-b268-2130731bd247"
                      alt="Historial"
                      style={{ height: "24px", width: "24px" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Historial" />
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/detalle"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/DETALLE.png?alt=media&token=2de03c3c-1dc1-41f4-bbdf-b4c5e31857b7"
                      alt="Detalle"
                      style={{ height: "24px", width: "24px" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Detalle" />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <List sx={{ display: "flex", flexDirection: "row", padding: 0, gap: "60px" }}>
              <ListItem
                button
                component={Link}
                to="/datos-recibo-table"
                sx={{ justifyContent: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/GASTOS.png?alt=media&token=e9261ba0-d22f-4d13-8ff0-213b23feb977"
                    alt="Gastos"
                    style={{ height: "24px", width: "24px" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Gastos"
                  sx={{ color: "#2E3192", textAlign: "center" }}
                />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/anticipo-table"
                sx={{ justifyContent: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ANTICIPOS.png?alt=media&token=f5f00653-d2c4-4919-8c33-7eb353f0cf7b"
                    alt="Anticipos"
                    style={{ height: "24px", width: "24px" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Anticipo"
                  sx={{ color: "#2E3192", textAlign: "center" }}
                />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/historial"
                sx={{ justifyContent: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/HISTORIAL.png?alt=media&token=fb09342e-37f7-4fc5-b268-2130731bd247"
                    alt="Historial"
                    style={{ height: "24px", width: "24px" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Historial"
                  sx={{ color: "#2E3192", textAlign: "center" }}
                />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/detalle"
                sx={{ justifyContent: "center" }}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/DETALLE.png?alt=media&token=2de03c3c-1dc1-41f4-bbdf-b4c5e31857b7"
                    alt="Detalle"
                    style={{ height: "24px", width: "24px" }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Detalle"
                  sx={{ color: "#2E3192", textAlign: "center" }}
                />
              </ListItem>
            </List>
          )}
        </Box>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          padding: 3,
          marginTop: user && user.role === "COLABORADOR" ? "128px" : "64px",
        }}
      />
    </Box>
  );
};

export default Navbar;