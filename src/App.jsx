import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Guestbook from "./pages/Guestbook";
import Wordle from "./pages/Wordle";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/guestbook" element={<Guestbook />} />
      <Route path="/wordle" element={<Wordle />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
