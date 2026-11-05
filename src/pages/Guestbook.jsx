import React, { useState } from "react";
import { Link } from "react-router-dom";

const GB_KEY = "guestbook_v1";

const SANS = "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

export default function Guestbook() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(GB_KEY));
      if (Array.isArray(stored) && stored.length) return stored;
    } catch {
      // ignore
    }
    return [
      { name: "Hafiz Yoosuf", date: "JUL 4, 2026", message: "Signed my own guestbook to make sure it works." },
    ];
  });

  const fmtDate = () => {
    const m = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const d = new Date();
    return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const handleSign = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMsg = message.trim();
    if (!trimmedName || !trimmedMsg) return;

    const newEntries = [
      { name: trimmedName, date: fmtDate(), message: trimmedMsg },
      ...entries,
    ];

    try {
      localStorage.setItem(GB_KEY, JSON.stringify(newEntries));
    } catch {
      // ignore
    }

    setEntries(newEntries);
    setName("");
    setMessage("");
  };

  return (
    <div
      data-screen-label="Guestbook"
      data-el="page"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        padding: "18px 32px 64px",
        fontFamily: SANS,
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 0",
          opacity: 0,
          animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 0ms forwards",
        }}
      >
        <Link to="/" className="brand-link">
          Hafiz Yoosuf
        </Link>
      </div>

      <div
        style={{
          padding: "28px 0 16px",
          opacity: 0,
          animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 80ms forwards",
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
          GUESTBOOK
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "44px", maxWidth: "560px", width: "100%" }}>
        <form
          onSubmit={handleSign}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            opacity: 0,
            animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 160ms forwards",
          }}
        >
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            autoComplete="off"
          />
          <textarea
            className="input-field"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a note"
            rows={3}
            style={{ resize: "vertical" }}
          />
          <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", marginTop: "4px" }}>
            SIGN GUESTBOOK
          </button>
        </form>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            opacity: 0,
            animation: "pf-in 700ms cubic-bezier(0.16,1,0.3,1) 240ms forwards",
          }}
        >
          {entries.map((entry, index) => (
            <div
              key={`${entry.name}-${entry.date}-${index}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                animation: "pf-in 500ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span
                  style={{
                    fontFamily: SANS,
                    fontWeight: 600,
                    fontSize: "15px",
                    lineHeight: "100%",
                    color: "#ffffff",
                  }}
                >
                  {entry.name}
                </span>
                <span
                  style={{
                    fontFamily: MONO,
                    fontWeight: 500,
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0.08em",
                    color: "#71717a",
                  }}
                >
                  {entry.date}
                </span>
              </div>
              <span
                style={{
                  fontFamily: SANS,
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "145%",
                  color: "#d4d4d8",
                  textWrap: "pretty",
                }}
              >
                {entry.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
