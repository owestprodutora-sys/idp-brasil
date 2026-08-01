import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import Admin from "@/pages/Admin";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import PreAnalysis from "@/pages/PreAnalysis";
import Privacidade from "@/pages/Privacidade";
import Register from "@/pages/Register";
import ThankYou from "@/pages/ThankYou";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pre-analise" element={<PreAnalysis />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/obrigado" element={<ThankYou />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
