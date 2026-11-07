import React, { useEffect, useState, useMemo } from "react";

export default function BinaryRadarLoader({ onComplete }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Stays active for exactly 2.4s as requested, then dissolves
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2400);

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2750);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Pre-generate monospace strings of 0s and 1s that fill any viewport size
  const zerosString = useMemo(() => "0".repeat(9000), []);
  const onesString = useMemo(() => "1".repeat(9000), []);

  return (
    <div
      data-binary-radar-loader
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 25,
        pointerEvents: "none",
        overflow: "hidden",
        background: "#080406",
        opacity: isFading ? 0 : 0.85,
        transition: "opacity 350ms cubic-bezier(0.16, 1, 0.3, 1)",
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
          fontSize: "11px",
          lineHeight: "14px",
          letterSpacing: "5px",
          wordBreak: "break-all",
          userSelect: "none",
          padding: "8px",
          color: "rgba(255, 255, 255, 0.22)",
          zIndex: 1,
        }}
      >
        {zerosString}
      </div>

      {/* TOP LAYER: 16% width rectangle mask scanning left to right with grid of ones */}
      <div
        className="radar-beam-mask"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background: "#080406",
          animation: "radar-sweep 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards",
          filter: "drop-shadow(0 0 16px rgba(243, 73, 81, 0.85))",
        }}
      >
        <div
          className="radar-grid radar-grid-ones"
          style={{
            position: "absolute",
            inset: 0,
            fontFamily: "'Geist Mono', ui-monospace, monospace",
            fontSize: "11px",
            lineHeight: "14px",
            letterSpacing: "5px",
            wordBreak: "break-all",
            userSelect: "none",
            padding: "8px",
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
