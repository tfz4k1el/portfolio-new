import React, { useMemo } from "react";

export default function BinaryRadarLoader({ isFading = false }) {
  // Pre-generate monospace strings of 0s and 1s that fill a project card
  const zerosString = useMemo(() => "0".repeat(1500), []);
  const onesString = useMemo(() => "1".repeat(1500), []);

  return (
    <div
      data-binary-radar-loader
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        pointerEvents: "none",
        overflow: "hidden",
        background: "#080406",
        opacity: isFading ? 0 : 0.85,
        transition: "opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      aria-hidden="true"
    >
      {/* BASE LAYER: Grid of zeros */}
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
        }}
      >
        {zerosString}
      </div>

      {/* TOP LAYER: 16% width rectangle mask scanning left to right with grid of ones (0.8s loop) */}
      <div
        className="radar-beam-mask"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "#080406",
          animation: "radar-sweep 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite",
          filter: "drop-shadow(0 0 14px rgba(243, 73, 81, 0.85))",
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
            textShadow: "0 0 8px #f34951, 0 0 16px rgba(243, 73, 81, 0.95)",
          }}
        >
          {onesString}
        </div>
      </div>
    </div>
  );
}
