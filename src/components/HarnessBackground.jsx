import React, { useState, useEffect } from "react";

/**
 * DeepSeek Harness gradient background.
 * Pure React + CSS: scattered moving ambient orbs, subtle tech grid, and tactile film grain noise.
 * Zero WebGL, zero canvas, zero runtime overhead.
 */
export default function HarnessBackground({ visible: propVisible = true }) {
  const [visible, setVisible] = useState(propVisible);

  useEffect(() => {
    setVisible(propVisible);
  }, [propVisible]);

  useEffect(() => {
    const handleShow = () => setVisible(true);
    window.addEventListener("show-harness-bg", handleShow);
    return () => window.removeEventListener("show-harness-bg", handleShow);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
        background: "#070406",
      }}
    >
      <div
        data-harness-glow
        style={{
          position: "absolute",
          inset: 0,
          opacity: visible ? 1 : 0,
          transition: "opacity 1200ms cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "opacity",
        }}
      >
      <style>{`
        @keyframes harness-orb-1 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-35px, 28px, 0) scale(1.08);
          }
        }
        @keyframes harness-orb-2 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(28px, -32px, 0) scale(0.94);
          }
        }
        @keyframes harness-orb-3 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.16;
          }
          50% {
            transform: translate3d(-18px, -15px, 0) scale(1.14);
            opacity: 0.24;
          }
        }
        @keyframes harness-orb-4 {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(40px, -20px, 0) scale(1.05);
          }
        }
      `}</style>

      {/* Scattered Orb 1: Primary Radiant Ruby & Blush Pink Halo (Top-Right) */}
      <div
        style={{
          position: "absolute",
          top: "-12%",
          right: "-8%",
          width: "65vw",
          height: "65vw",
          maxWidth: "920px",
          maxHeight: "920px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 170, 198, 0.22) 0%, rgba(228, 42, 62, 0.16) 32%, rgba(70, 10, 24, 0.28) 60%, transparent 75%)",
          filter: "blur(65px)",
          animation: "harness-orb-1 22s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Scattered Orb 2: Luminous Soft White Peak Highlight (Upper Right Center) */}
      <div
        style={{
          position: "absolute",
          top: "16%",
          right: "14%",
          width: "28vw",
          height: "28vw",
          maxWidth: "420px",
          maxHeight: "420px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 246, 248, 0.18) 0%, rgba(255, 170, 198, 0.10) 45%, transparent 72%)",
          filter: "blur(45px)",
          animation: "harness-orb-3 17s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
      />

      {/* Scattered Orb 3: Deep Velvet Crimson Wine Shadow (Mid Left / Center) */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "-10%",
          width: "55vw",
          height: "55vw",
          maxWidth: "780px",
          maxHeight: "780px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(228, 42, 62, 0.10) 0%, rgba(38, 8, 16, 0.45) 45%, transparent 75%)",
          filter: "blur(80px)",
          animation: "harness-orb-2 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* Scattered Orb 4: Subtle Ambient Velvet Pool (Bottom Center / Right) */}
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "30%",
          width: "50vw",
          height: "45vw",
          maxWidth: "700px",
          maxHeight: "650px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(140, 18, 36, 0.14) 0%, rgba(38, 8, 16, 0.35) 50%, transparent 75%)",
          filter: "blur(75px)",
          animation: "harness-orb-4 28s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* DeepSeek Harness Orthogonal Tech Grid Matrix */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.016) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.016) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          opacity: 0.85,
        }}
      />

      {/* Soft Perimeter Vignette for Contrast & Focus */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(7, 4, 6, 0.72) 100%)",
        }}
      />
      </div>
    </div>
  );
}
