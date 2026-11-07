import React, { useMemo } from "react";

export default function BinaryRadarLoader({ isWiping = false }) {
  // Pre-generate monospace strings of 0s and 1s that fill a project card (800 chars cleanly covers 387x218px)
  const zerosString = useMemo(() => "0".repeat(800), []);
  const onesString = useMemo(() => "1".repeat(800), []);

  return (
    <div
      data-binary-radar-loader
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        overflow: "hidden",
        background: "transparent",
        contain: "strict",
      }}
      aria-hidden="true"
    >
      {/* BASE LAYER: Grid of zeros. In loops 1-3, stays 100% normal. In loop 4, permanently wiped out as the beam passes. */}
      <div
        className="radar-grid radar-grid-zeros"
        style={{
          position: "absolute",
          inset: 0,
          fontFamily: "'Geist Mono', ui-monospace, monospace",
          fontSize: "10px",
          lineHeight: "13px",
          letterSpacing: "4px",
          wordBreak: "break-all",
          userSelect: "none",
          padding: "6px",
          color: "rgba(255, 255, 255, 0.22)",
          zIndex: 1,
          background: "transparent",
          willChange: isWiping ? "clip-path" : "auto",
          animation: isWiping
            ? "wipe-out-zeros 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards"
            : "none",
        }}
      >
        {zerosString}
      </div>

      {/* TOP LAYER: Warped uneven mask scanning left to right with glowing ones (increased neon bloom) */}
      <div
        className="radar-beam-mask"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "transparent",
          willChange: "clip-path",
          animation: isWiping
            ? "radar-sweep-ones 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards"
            : "radar-sweep-ones 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite",
        }}
      >
        <div
          className="radar-grid radar-grid-ones"
          style={{
            position: "absolute",
            inset: 0,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: "10px",
            lineHeight: "13px",
            letterSpacing: "4px",
            wordBreak: "break-all",
            userSelect: "none",
            padding: "6px",
            color: "#f34951",
            fontWeight: 700,
            textShadow: "0 0 6px #f34951, 0 0 12px rgba(243, 73, 81, 0.65)",
          }}
        >
          {onesString}
        </div>
      </div>
    </div>
  );
}
