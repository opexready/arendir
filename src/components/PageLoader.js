import React from "react";
import { Box, Skeleton } from "@mui/material";

// ── Skeleton para tabla ──────────────────────────────────────────────────────
export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <Box sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #E2E6F0" }}>
    {/* Header */}
    <Box sx={{ background: "#2E3192", p: "13px 16px", display: "flex", gap: 2 }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} variant="text" width={`${100 / cols}%`} height={16}
          sx={{ bgcolor: "rgba(255,255,255,0.15)", borderRadius: 1 }} />
      ))}
    </Box>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <Box key={i} sx={{
        display: "flex", gap: 2, p: "13px 16px",
        borderBottom: "1px solid #F0F2F8",
        background: i % 2 === 0 ? "#fff" : "#FAFBFD",
        animation: `fadeIn 0.4s ease ${i * 0.06}s both`,
        "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
      }}>
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} variant="text" width={`${100 / cols}%`} height={14}
            sx={{ bgcolor: "#F0F2F8", borderRadius: 1 }} />
        ))}
      </Box>
    ))}
  </Box>
);

// ── Skeleton para cards de servicio ─────────────────────────────────────────
export const ServiceCardsSkeleton = () => (
  <Box sx={{
    display: "grid",
    gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
    gap: 2.5,
  }}>
    {Array.from({ length: 4 }).map((_, i) => (
      <Box key={i} sx={{
        background: "#fff", borderRadius: "20px", p: "28px 16px 20px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        boxShadow: "0 4px 16px rgba(46,49,146,0.06)",
        animation: `scaleIn 0.4s ease ${i * 0.08}s both`,
        "@keyframes scaleIn": { from: { opacity: 0, transform: "scale(0.92)" }, to: { opacity: 1, transform: "scale(1)" } },
      }}>
        <Skeleton variant="rounded" width={72} height={72} sx={{ bgcolor: "#F0F2F8", borderRadius: "16px" }} />
        <Skeleton variant="text" width={80} height={16} sx={{ bgcolor: "#F0F2F8" }} />
      </Box>
    ))}
  </Box>
);

// ── Skeleton para formulario ─────────────────────────────────────────────────
export const FormSkeleton = ({ fields = 6 }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    {Array.from({ length: fields }).map((_, i) => (
      <Box key={i} sx={{
        animation: `slideUp 0.4s ease ${i * 0.05}s both`,
        "@keyframes slideUp": { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      }}>
        <Skeleton variant="text" width={100} height={12} sx={{ bgcolor: "#F0F2F8", mb: 0.5 }} />
        <Skeleton variant="rounded" width="100%" height={44} sx={{ bgcolor: "#F0F2F8", borderRadius: "10px" }} />
      </Box>
    ))}
  </Box>
);

// ── Skeleton para historial (2 columnas) ─────────────────────────────────────
export const HistorialSkeleton = () => (
  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>
    {[0, 1].map((col) => (
      <Box key={col} sx={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #E2E6F0" }}>
        <Box sx={{ background: "#2E3192", p: "14px 20px" }}>
          <Skeleton variant="text" width={120} height={18} sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
        </Box>
        {Array.from({ length: 6 }).map((_, i) => (
          <Box key={i} sx={{
            display: "flex", justifyContent: "space-between", px: 2.5, py: 1.5,
            borderBottom: "1px solid #F0F2F8",
            animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
            "@keyframes fadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
          }}>
            <Skeleton variant="text" width={70} height={14} sx={{ bgcolor: "#F0F2F8" }} />
            <Skeleton variant="text" width={90} height={14} sx={{ bgcolor: "#F0F2F8" }} />
          </Box>
        ))}
      </Box>
    ))}
  </Box>
);

// ── Skeleton para perfil ──────────────────────────────────────────────────────
export const ProfileSkeleton = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <Box sx={{ background: "#2E3192", borderRadius: "12px 12px 0 0", p: "14px 20px" }}>
      <Skeleton variant="text" width={180} height={20} sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />
    </Box>
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, p: 1 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Box key={i} sx={{
          animation: `slideUp 0.4s ease ${i * 0.04}s both`,
          "@keyframes slideUp": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        }}>
          <Skeleton variant="text" width={90} height={12} sx={{ bgcolor: "#F0F2F8", mb: 0.5 }} />
          <Skeleton variant="rounded" width="100%" height={44} sx={{ bgcolor: "#F0F2F8", borderRadius: "10px" }} />
        </Box>
      ))}
    </Box>
  </Box>
);

// ── Full page fade wrapper ────────────────────────────────────────────────────
export const PageFade = ({ children, ready }) => (
  <Box sx={{
    opacity: ready ? 1 : 0,
    transform: ready ? "translateY(0)" : "translateY(8px)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
  }}>
    {children}
  </Box>
);

export default TableSkeleton;
