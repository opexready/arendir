import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Toolbar, Button, Box, IconButton,
  Menu, MenuItem, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningIcon from "@mui/icons-material/Warning";
import api from "../api";
import "../arendir-design.css";

const NAV_ITEMS = [
  { label: "Gastos",   to: "/datos-recibo-table", iconUrl: "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/GASTOS.png?alt=media&token=e9261ba0-d22f-4d13-8ff0-213b23feb977" },
  { label: "Anticipo", to: "/anticipo-table",      iconUrl: "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ANTICIPOS.png?alt=media&token=f5f00653-d2c4-4919-8c33-7eb353f0cf7b" },
  { label: "Historial",to: "/historial",           iconUrl: "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/HISTORIAL.png?alt=media&token=fb09342e-37f7-4fc5-b268-2130731bd247" },
  { label: "Detalle",  to: "/detalle",             iconUrl: "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/DETALLE.png?alt=media&token=2de03c3c-1dc1-41f4-bbdf-b4c5e31857b7" },
];

const FIELD_LABELS = { dni: "DNI", cargo: "Cargo", banco: "Banco", cuenta_bancaria: "Cuenta Bancaria" };

/* Botones del diálogo "¿Cerrar sesión?": mismo alto, mismo tamaño de letra y sin partir el texto */
const LOGOUT_BTN_SX = {
  flex: 1, height: 44, px: 2.5, borderRadius: "10px", textTransform: "none",
  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, whiteSpace: "nowrap",
};

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await api.get("/api/users/me/");
        setUser(res.data);
        if (res.data.role !== "ADMIN") {
          const missing = ["dni", "cargo", "banco", "cuenta_bancaria"].filter((f) => !res.data[f]);
          if (missing.length > 0) { setMissingFields(missing); setOpenProfileDialog(true); }
        }
      } catch {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => { localStorage.removeItem("token"); setUser(null); navigate("/login"); };
  const isColaboradorPage = location.pathname.startsWith("/colaborador");
  const showSubnav = user && user.role === "COLABORADOR" && !isColaboradorPage;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <AppBar position="fixed" elevation={scrolled ? 3 : 0}
        sx={{ background: "#1B3B6F", boxShadow: scrolled ? "0 4px 20px rgba(27,59,111,0.3)" : "0 2px 8px rgba(27,59,111,0.15)", zIndex: (t) => t.zIndex.drawer + 1, transition: "box-shadow 0.3s" }}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, gap: 1 }}>
          <IconButton color="inherit" onClick={() => navigate(-1)}
            sx={{ borderRadius: "10px", "&:hover": { background: "rgba(255,255,255,0.12)", transform: "translateX(-2px)" }, transition: "all 0.2s" }}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton color="inherit" onClick={() => navigate("/profile")}
                sx={{ borderRadius: "10px", "&:hover": { background: "rgba(255,255,255,0.12)" }, transition: "all 0.2s" }}>
                <AccountCircleIcon fontSize="small" />
              </IconButton>
              <Box component="img"
                src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/logoblanco2.png?alt=media&token=94ceb944-93e9-4361-83d3-75017559ab67"
                alt="Arendir" onClick={() => setOpenLogoutDialog(true)}
                sx={{ height: 36, cursor: "pointer", opacity: 0.95, transition: "all 0.2s", "&:hover": { opacity: 1, transform: "scale(1.03)" } }} />
            </Box>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}
              sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 13, textTransform: "none" }}>
              Iniciar sesión
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {showSubnav && (
        <Box sx={{ position: "fixed", top: { xs: 56, sm: 64 }, left: 0, right: 0, zIndex: (t) => t.zIndex.drawer, background: "#fff", borderBottom: "1px solid #E2E6F0", boxShadow: "0 2px 8px rgba(27,59,111,0.06)" }}>
          {isMobile ? (
            <Box sx={{ px: 2, py: 0.5, display: "flex", alignItems: "center" }}>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "#1B3B6F", borderRadius: "10px" }}><MenuIcon /></IconButton>
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "#1B3B6F", ml: 1 }}>
                {NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))?.label || "Menú"}
              </Typography>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { borderRadius: "12px", boxShadow: "0 8px 32px rgba(27,59,111,0.15)", minWidth: 180 } }}>
                {NAV_ITEMS.map((item) => (
                  <MenuItem key={item.to} component={Link} to={item.to} onClick={() => setAnchorEl(null)}
                    selected={location.pathname.startsWith(item.to)}
                    sx={{ gap: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 13, "&.Mui-selected": { background: "#E6EEF8", color: "#1B3B6F" } }}>
                    <img src={item.iconUrl} alt={item.label} style={{ width: 20, height: 20 }} />
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", px: 3, gap: 0.5 }}>
              {NAV_ITEMS.map((item, i) => {
                const active = location.pathname.startsWith(item.to);
                return (
                  <Link key={item.to} to={item.to} style={{ textDecoration: "none" }}>
                    <Box sx={{
                      display: "flex", alignItems: "center", gap: "7px", px: 2, py: 1.25, borderRadius: "8px",
                      fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 13,
                      color: active ? "#1B3B6F" : "#9099B5",
                      background: active ? "#E6EEF8" : "transparent",
                      position: "relative", transition: "all 0.2s", cursor: "pointer",
                      "&:hover": { color: "#1B3B6F", background: "#E6EEF8" },
                    }}>
                      <img src={item.iconUrl} alt={item.label}
                        style={{ width: 18, height: 18, filter: active ? "invert(18%) sepia(98%) saturate(800%) hue-rotate(213deg)" : "invert(60%) sepia(10%) saturate(400%) hue-rotate(180deg)", transition: "filter 0.2s" }} />
                      {item.label}
                      {active && <Box sx={{ position: "absolute", bottom: -1, left: "20%", width: "60%", height: "2px", background: "#10B981", borderRadius: "2px" }} />}
                    </Box>
                  </Link>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "#fef9e7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WarningIcon sx={{ color: "#d4ac0d", fontSize: 20 }} />
          </Box>
          Datos requeridos
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#5A6280", mb: 1.5 }}>
            Completa los siguientes datos en tu perfil:
          </Typography>
          {missingFields.map((f) => (
            <Box key={f} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#2D3350" }}>{FIELD_LABELS[f] || f}</Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button fullWidth variant="contained" onClick={() => { navigate("/profile"); setOpenProfileDialog(false); }}
            sx={{ background: "#1B3B6F", borderRadius: "10px", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, textTransform: "none", py: 1.2, "&:hover": { background: "#10233F" } }}>
            Actualizar perfil
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
        <DialogTitle sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18, color: "#2D3350" }}>¿Cerrar sesión?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.6, color: "#5A6280" }}>Se cerrará tu sesión actual en Arendir.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1.5, "& > :not(:first-of-type)": { ml: 0 } }}>
          <Button onClick={() => setOpenLogoutDialog(false)}
            sx={{ ...LOGOUT_BTN_SX, border: "1.5px solid #E2E6F0", color: "#5A6280", fontWeight: 600, "&:hover": { background: "#F8F9FC", borderColor: "#C9CEDD" } }}>
            Cancelar
          </Button>
          <Button onClick={() => { setOpenLogoutDialog(false); handleLogout(); }} variant="contained"
            sx={{ ...LOGOUT_BTN_SX, fontWeight: 700, background: "#1B3B6F", boxShadow: "0 4px 12px rgba(27,59,111,0.3)", "&:hover": { background: "#10233F" } }}>
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>

      {/* This spacer pushes page content below the fixed navbar */}
      <Box sx={{
        height: showSubnav
          ? { xs: "108px", sm: "120px" }
          : { xs: "60px", sm: "68px" },
        flexShrink: 0,
      }} />
    </Box>
  );
};

export default Navbar;
