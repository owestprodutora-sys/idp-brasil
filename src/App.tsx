import { useLocation } from "react-router-dom";

import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { AppRoutes } from "@/routes";

function App() {
  const { pathname } = useLocation();
  const hideFloatingWidgets = pathname === "/login" || pathname.startsWith("/admin");
  const isHome = pathname === "/";

  return (
    <>
      <AppRoutes />
      {!hideFloatingWidgets && <WhatsAppFloatButton raised={isHome} />}
    </>
  );
}

export default App;
