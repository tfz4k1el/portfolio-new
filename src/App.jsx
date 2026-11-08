import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Guestbook from "./pages/Guestbook";
import Wordle from "./pages/Wordle";
import HarnessBackground from "./components/HarnessBackground";

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  // On home page, background gradient starts at opacity: 0; on other pages, it's visible by default
  const [bgVisible, setBgVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setBgVisible(true);
    }
  }, [isHome]);

  return (
    <>
      <HarnessBackground visible={bgVisible} />
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home onShowBg={() => setBgVisible(true)} />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="/wordle" element={<Wordle />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
