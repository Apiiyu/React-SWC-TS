// i18next

// i18n
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Modules
import appEn from '@/app/locales/en.json';
import appId from '@/app/locales/id.json';
import authenticationEn from '@/modules/authentication/locales/en.json';
import authenticationId from '@/modules/authentication/locales/id.json';
import dashboardEn from '@/modules/dashboard/locales/en.json';
import dashboardId from '@/modules/dashboard/locales/id.json';

/**
 * @description Namespaces are bundled statically here per module. When a
 * new module is generated (`bun run generate:module`), register its locale
 * files under a namespace matching the module's kebab-case name.
 */
void i18n.use(initReactI18next).init({
  resources: {
    en: {
      app: appEn,
      dashboard: dashboardEn,
      authentication: authenticationEn,
    },
    id: {
      app: appId,
      dashboard: dashboardId,
      authentication: authenticationId,
    },
  },
  lng: 'id',
  fallbackLng: 'en',
  defaultNS: 'app',
  interpolation: { escapeValue: false },
});

export default i18n;
