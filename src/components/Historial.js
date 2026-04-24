import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Alert, Collapse, Chip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import axios from "axios";
import "../arendir-design.css";
import { HistorialSkeleton, PageFade } from "./PageLoader";
import api, { baseURL } from "../api";

const STATUS_COLORS = {
  "ABONADO":    { bg: "#e8f8f5", color: "#00a381", border: "#00B894" },
  "NUEVO":      { bg: "#E8EAF6", color: "#2E3192", border: "#2E3192" },
  "POR APROBAR":{ bg: "#fef9e7", color: "#9a7d0a", border: "#fdcb6e" },
  "TERMINADO":  { bg: "#e8f8f5", color: "#00a381", border: "#00B894" },
  "RECHAZADO":  { bg: "#fef0ee", color: "#c0392b", border: "#e17055" },
};

const HistorialTable = ({ title, icon, data, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  // Sort by nombre descending (R00010 before R00001)
  const sorted = [...data].sort((a, b) => b.nombre.localeCompare(a.nombre));

  return (
    <Box sx={{
      border: "1px solid #E2E6F0", borderRadius: "16px", overflow: "hidden",
      boxShadow: "0 2px 16px rgba(46,49,146,0.06)",
      animation: "fadeUp 0.4s ease both",
      "@keyframes fadeUp": { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
    }}>
      {/* Header — clickable to collapse */}
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          background: "#2E3192", color: "#fff",
          px: 2.5, py: 1.5,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", userSelect: "none",
          transition: "background 0.2s",
          "&:hover": { background: "#1F237A" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <img src={icon} alt="" style={{ height: 22, filter: "brightness(0) invert(1)" }} />
          <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.5px" }}>
            {title}
          </Typography>
          <Box sx={{ background: "rgba(255,255,255,0.2)", borderRadius: "12px", px: 1, py: 0.2 }}>
            <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 12 }}>
              {data.length}
            </Typography>
          </Box>
        </Box>
        {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
      </Box>

      {/* Collapsible content */}
      <Collapse in={open}>
        {/* Column headers */}
        <Box sx={{ display: "flex", justifyContent: "space-between", px: 2.5, py: 1, background: "#F8F9FC", borderBottom: "1px solid #E2E6F0" }}>
          <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#5A6280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {title === "GASTO" ? "Gasto" : "Anticipo"}
          </Typography>
          <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "#5A6280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Estado
          </Typography>
        </Box>

        {/* Rows */}
        {sorted.map((item, i) => {
          const statusStyle = STATUS_COLORS[item.estado] || { bg: "#F0F2F8", color: "#5A6280", border: "#E2E6F0" };
          return (
            <Box key={i} sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              px: 2.5, py: 1.2, borderBottom: "1px solid #F0F2F8",
              background: i % 2 === 0 ? "#fff" : "#FAFBFD",
              transition: "background 0.15s",
              animation: `fadeIn 0.3s ease ${i * 0.03}s both`,
              "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
              "&:hover": { background: "#F0F2F8" },
              "&:last-child": { borderBottom: "none" },
            }}>
              <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "#2D3350" }}>
                {item.nombre}
              </Typography>
              <Chip
                label={item.estado}
                size="small"
                sx={{
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600, fontSize: 11,
                  height: 24, borderRadius: "12px",
                }}
              />
            </Box>
          );
        })}

        {data.length === 0 && (
          <Box sx={{ px: 2.5, py: 3, textAlign: "center" }}>
            <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#9099B5" }}>
              Sin registros
            </Typography>
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

const Historial = () => {
  const [rendiciones, setRendiciones] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorialData = async () => {
      try {
        const userResponse = await api.get('/api/users/me/');
        const userId = userResponse.data.id;
        const [rendicionesResponse, solicitudesResponse] = await Promise.all([
          axios.get(`${baseURL}/api/rendiciones/nombres`, { params: { id_user: userId, tipo: "RENDICION" } }),
          axios.get(`${baseURL}/api/solicitud/nombres`, { params: { id_user: userId } }),
        ]);
        setRendiciones(rendicionesResponse.data);
        setSolicitudes(solicitudesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del historial:", error);
        setError("Hubo un error al cargar los datos. Por favor, intenta nuevamente.");
        setLoading(false);
      }
    };
    fetchHistorialData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ paddingTop: 2 }}>
        <HistorialSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ paddingTop: 2 }}>
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>
      </Container>
    );
  }

  return (
    <PageFade ready={!loading}>
      <Container sx={{ paddingTop: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <HistorialTable
            title="GASTO"
            icon="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa5.png?alt=media&token=b6854d9a-a91c-4930-bac3-150808ccabe5"
            data={rendiciones}
            defaultOpen={true}
          />
          <HistorialTable
            title="ANTICIPO"
            icon="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/pa6.png?alt=media&token=7ac20ab7-9ee1-45f3-ad4f-ab7d40c3e2cc"
            data={solicitudes}
            defaultOpen={true}
          />
        </Box>
      </Container>
    </PageFade>
  );
};

export default Historial;
