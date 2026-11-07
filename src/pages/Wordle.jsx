import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AsciiReveal } from "ascii-reveal";

const TILE_COLORS = { g: "#6aaa64", y: "#c9b458", b: "#27272a" };
const WD_KEY = "wordle_data";
const WD_API = "https://z4ffy--2b4917f477ec11f1bd2f1607ee4eb77e.web.val.run";

const DEFAULT_DATA = {
  puzzle: "1,840",
  score: "5/6",
  streak: 34,
  rows: [
    ["y", "b", "b", "y", "b"],
    ["g", "b", "b", "y", "b"],
    ["b", "b", "b", "b", "y"],
    ["g", "b", "y", "y", "y"],
    ["g", "g", "g", "g", "g"],
  ],
};

const SANS = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

export default function Wordle() {
  const [data, setData] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(WD_KEY));
      if (s && Array.isArray(s.rows)) return s;
    } catch {
      // ignore
    }
    return DEFAULT_DATA;
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== WD_KEY) return;
      try {
        const s = JSON.parse(e.newValue);
        if (s && Array.isArray(s.rows)) setData(s);
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", onStorage);

    if (WD_API) {
      fetch(WD_API, { cache: "no-store" })
        .then((r) => r.json())
        .then((s) => {
          let record = s;
          if (s && s.record) record = s.record;
          if (!record || !Array.isArray(record.rows)) return;
          try {
            localStorage.setItem(WD_KEY, JSON.stringify(record));
          } catch {
            // ignore
          }
          setData(record);
        })
        .catch(() => {});
    }

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const streak = data.streak ?? DEFAULT_DATA.streak;

  return (
    <AsciiReveal
      as="div"
      preset="terminal"
      duration="cinematic"
      data-screen-label="Wordle"
      data-el="page"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        padding: "18px 32px",
        fontFamily: SANS,
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 0",
        }}
      >
        <Link to="/" className="brand-link" data-ascii="fade">
          Hafiz Yoosuf
        </Link>
      </div>

      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          paddingBottom: "56px",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "100%",
            letterSpacing: "0.08em",
            color: "#8a8a8a",
          }}
        >
          WORDLE
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "100%",
              color: "#ffffff",
            }}
          >
            Wordle {data.puzzle} {data.score}
          </span>

          <div
            data-ascii="skip"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 44px)",
              gridAutoRows: "44px",
              gap: "8px",
            }}
          >
            {data.rows.map((row, ri) =>
              row.map((c, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  data-tile=""
                  style={{
                    borderRadius: "3px",
                    background: TILE_COLORS[c] || "#27272a",
                    animationDelay: `${240 + (ri * 5 + ci) * 35}ms`,
                    cursor: "default",
                  }}
                />
              ))
            )}
          </div>

          {streak != null && (
            <span
              style={{
                fontFamily: MONO,
                fontWeight: 500,
                fontSize: "13px",
                lineHeight: "100%",
                letterSpacing: "0.08em",
                color: "#8a8a8a",
                textTransform: "uppercase",
                marginTop: "4px",
              }}
            >
              STREAK · <span style={{ color: "#ffffff", fontWeight: 600 }}>{streak}</span>
            </span>
          )}
        </div>
      </div>
    </AsciiReveal>
  );
}
