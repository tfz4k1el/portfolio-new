import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Guestbook from "./pages/Guestbook";
import Wordle from "./pages/Wordle";
import HarnessBackground from "./components/HarnessBackground";

export default function App() {
  return (
    <>
      <HarnessBackground />
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/guestbook" element={<Guestbook />} />
          <Route path="/wordle" element={<Wordle />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
