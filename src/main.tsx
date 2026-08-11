import '@/plugins/i18n/i18n';
// vite-plugin-svg-icons sprite — without this, AppBaseSvg never has anything to reference
import 'virtual:svg-icons-register';
import './index.css';

// React
import { createRoot } from 'react-dom/client';

// React Router DOM
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AppCommonEntryPoint />
  </BrowserRouter>,
);
