import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { AppRoutes } from "@/routes";
import { initAnalytics, trackPageView } from "@/lib/analytics";

function App() {
  const { pathname } = useLocation();
  const hideFloatingWidgets = pathname === "/login" || pathname.startsWith("/admin");
  const isHome = pathname === "/";

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return (
    <>
      <AppRoutes />
      {!hideFloatingWidgets && <WhatsAppFloatButton raised={isHome} />}
    </>
  );
}

export default App;
