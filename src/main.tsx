// React Router DOM
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Plugins
import "@/plugins/i18n/i18n";

// vite-plugin-svg-icons sprite — without this, AppBaseSvg never has anything to reference
import "virtual:svg-icons-register";

// Styles
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppCommonEntryPoint />
  </BrowserRouter>
);
