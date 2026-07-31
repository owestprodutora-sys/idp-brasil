import { Route, Routes } from "react-router-dom";

import About from "@/pages/About";
import Home from "@/pages/Home";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<About />} />
    </Routes>
  );
}
