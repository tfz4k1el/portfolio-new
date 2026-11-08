import React from "react";

/**
 * Lightweight, zero-WebGL DeepSeek Harness gradient background.
 * Pure CSS layered radial gradients + subtle orthogonal tech grid.
 */
export default function HarnessBackground() {
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
      {/* Deep velvet wine base ambient warmth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 75% 30%, rgba(38, 8, 16, 0.85) 0%, transparent 60%)",
        }}
      />

      {/* Signature radiant ruby & blush pink glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 82% 34%, rgba(255, 170, 198, 0.22) 0%, rgba(228, 42, 62, 0.18) 25%, rgba(140, 18, 36, 0.10) 48%, transparent 72%)",
        }}
      />

      {/* Luminous soft white core light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 80% 32%, rgba(255, 246, 248, 0.16) 0%, transparent 22%)",
        }}
      />

      {/* Subtle secondary ambient warmth in bottom-left */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 15% 85%, rgba(228, 42, 62, 0.05) 0%, rgba(38, 8, 16, 0.08) 35%, transparent 60%)",
        }}
      />

      {/* DeepSeek Harness Orthogonal Tech Grid Matrix */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.018) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.018) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          opacity: 0.8,
        }}
      />

      {/* Soft perimeter vignette for contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(7, 4, 6, 0.75) 100%)",
        }}
      />
    </div>
  );
}
