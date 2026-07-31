import { Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import PreAnalysis from "@/pages/PreAnalysis";
import Register from "@/pages/Register";
import ThankYou from "@/pages/ThankYou";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pre-analise" element={<PreAnalysis />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/obrigado" element={<ThankYou />} />
    </Routes>
  );
}
