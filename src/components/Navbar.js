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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import api from "../api";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
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
          <Typography variant="h6" sx={{ flexGrow: 1, marginLeft: "10px" }} />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {user ? (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
                alt="Logo"
                style={{ height: "40px", cursor: "pointer" }}
                onClick={handleLogout}
              />
            ) : (
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Render options bar only if the user is logged in as "COLABORADOR" and not on a collaborator page */}
      {user && user.role === "COLABORADOR" && !isColaboradorPage && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start", // Cambiado de "center" a "flex-start"
            backgroundColor: "#f5f5f5",
            paddingY: 1,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            marginTop: "64px",
            paddingLeft: 2, // Añadido para dar un poco de espacio a la izquierda
          }}
        >
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ color: "#2E3192" }} // Añadido para que el ícono tenga color
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