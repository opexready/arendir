import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Container, Skeleton } from "@mui/material";
import api from "../api";
import "../arendir-design.css";
import { ServiceCardsSkeleton } from "./PageLoader";

const SERVICES = [
  { label: "Gastos",    link: "/datos-recibo-table", iconUrl: "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ICONO_GASTOS.png?alt=media&token=8dc8b602-bf9f-40ec-a5e9-e517d7e6c212" },
  { label: "Anticipo",  link: "/anticipo-table",     iconUrl: "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ICO_ANTICIPADO.png?alt=media&token=90d18d4e-a1c1-453c-8084-806f1a1dee28" },
  { label: "Historial", link: "/historial",           iconUrl: "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ICONO_HISTORIAL.png?alt=media&token=927a3ebc-fd4b-4f65-9cec-f04be428dbc9" },
  { label: "Detalle",   link: "/detalle",             iconUrl: "https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/ICONO_DETALLE.png?alt=media&token=086c4705-37f8-4c04-979f-9134eb3a9a97" },
];

const ColaboradorModule = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/users/me/")
      .then((r) => setUser(r.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1a1f5e 0%, #2E3192 50%, #3949AB 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", px: 2, pb: 6,
    }}>
      {/* Background decorations */}
      {[
        { size: 500, top: "-150px", right: "-150px" },
        { size: 300, bottom: "-80px", left: "-80px" },
        { size: 200, top: "40%", right: "5%" },
      ].map((c, i) => (
        <Box key={i} sx={{
          position: "absolute", width: c.size, height: c.size, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
          top: c.top, bottom: c.bottom, left: c.left, right: c.right, pointerEvents: "none",
        }} />
      ))}

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        {/* Greeting */}
        <Box sx={{ textAlign: "center", mb: 4, animation: "fadeUp 0.6s ease" }}>
          {loading ? (
  <ServiceCardsSkeleton />
          ) : (
            <>
              <Typography sx={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                color: "rgba(255,255,255,0.6)", mb: 0.5, letterSpacing: "0.5px",
              }}>
                Hola, {user?.full_name?.split(" ")[0] || "Usuario"} 👋
              </Typography>
              <Typography sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
                fontSize: { xs: 26, sm: 32 }, color: "#fff", lineHeight: 1.1,
              }}>
                ¿Qué necesitas gestionar hoy?
              </Typography>
            </>
          )}
        </Box>

        {/* Service grid */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
          gap: { xs: 2, sm: 2.5 },
        }}>
          {SERVICES.map((svc, i) => (
            <Box key={svc.label} onClick={() => navigate(svc.link)}
              sx={{
                background: "rgba(255,255,255,0.95)",
                borderRadius: "20px",
                padding: { xs: "20px 12px", sm: "28px 16px 20px" },
                display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                animation: `cardIn 0.5s ease ${i * 0.08}s both`,
                position: "relative", overflow: "hidden",
                "@keyframes cardIn": { from: { opacity: 0, transform: "translateY(24px) scale(0.9)" }, to: { opacity: 1, transform: "translateY(0) scale(1)" } },
                "&::before": {
                  content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                  background: "#F15A29", transform: "scaleX(0)", transformOrigin: "left",
                  transition: "transform 0.3s ease",
                },
                "&:hover": { transform: "translateY(-6px)", boxShadow: "0 16px 48px rgba(0,0,0,0.2)" },
                "&:hover::before": { transform: "scaleX(1)" },
                "&:active": { transform: "translateY(-3px) scale(0.98)" },
              }}>
              <Box sx={{
                width: { xs: 60, sm: 72 }, height: { xs: 60, sm: 72 },
                borderRadius: "16px", background: "#F15A29",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 8px 20px rgba(241,90,41,0.35)",
                transition: "all 0.3s ease",
                ".MuiBox-root:hover &": { transform: "scale(1.1) rotate(-4deg)", boxShadow: "0 12px 28px rgba(241,90,41,0.5)" },
              }}>
                <Box component="img" src={svc.iconUrl} alt={svc.label}
                  sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
              </Box>
              <Typography sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                fontSize: { xs: 13, sm: 14 }, color: "#2E3192", textAlign: "center",
              }}>
                {svc.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Company chip */}
        {user && (
          <Box sx={{
            display: "flex", justifyContent: "center", mt: 4,
            animation: "fadeUp 0.6s ease 0.4s both",
          }}>
            <Box sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "20px", px: 2.5, py: 1,
            }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#F15A29", animation: "pulse 2s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } } }} />
              <Typography sx={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                {user.company_name || user.empresa || "Arendir"}
              </Typography>
            </Box>
          </Box>
        )}
      </Container>

      {/* Bottom icon */}
      <Box component="img"
        src="https://firebasestorage.googleapis.com/v0/b/hawejin-files.appspot.com/o/iconoflecha.png?alt=media&token=a194d960-a3db-4b60-9436-6fea452060a0"
        alt=""
        sx={{ position: "fixed", bottom: 20, left: 20, width: 36, height: 36, opacity: 0.5 }} />
    </Box>
  );
};

export default ColaboradorModule;
