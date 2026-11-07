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
        background: "transparent",
        opacity: isFading ? 0 : 1,
        transition: "opacity 300ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      aria-hidden="true"
    >
      {/* BASE LAYER: Grid of zeros, masked with exclusion so zeroes disappear under the sweep */}
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
          color: "rgba(255, 255, 255, 0.2)",
          zIndex: 1,
          background: "transparent",
          animation: "radar-sweep-zeros 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite",
        }}
      >
        {zerosString}
      </div>

      {/* TOP LAYER: Warped uneven mask scanning left to right with glowing ones (0.8s loop, subtle bloom) */}
      <div
        className="radar-beam-mask"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "transparent",
          animation: "radar-sweep-ones 0.8s cubic-bezier(0.25, 1, 0.5, 1) infinite",
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
            fontWeight: 600,
            textShadow: "0 0 3px rgba(243, 73, 81, 0.75)",
          }}
        >
          {onesString}
        </div>
      </div>
    </div>
  );
}
