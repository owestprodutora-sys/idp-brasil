import { Route, Routes } from "react-router-dom";

import Home from "@/pages/Home";
import PreAnalysis from "@/pages/PreAnalysis";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pre-analise" element={<PreAnalysis />} />
    </Routes>
  );
}
