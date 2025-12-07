import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enServer from './locales/en/server.json';
import enAdmin from './locales/en/admin.json';

import zhCommon from './locales/zh/common.json';
import zhAuth from './locales/zh/auth.json';
import zhDashboard from './locales/zh/dashboard.json';
import zhServer from './locales/zh/server.json';
import zhAdmin from './locales/zh/admin.json';

// Get user language from window object (set by Laravel)
const getUserLanguage = (): string => {
    // @ts-expect-error PterodactylUser is injected by the server
    const userLang = window.PterodactylUser?.language;
    if (userLang) return userLang;

    // Fallback to site default locale (from .env APP_LOCALE)
    // @ts-expect-error SiteConfiguration is injected by the server
    const siteLocale = window.SiteConfiguration?.locale;
    return siteLocale || 'en';
};

const resources = {
    en: {
        common: enCommon,
        auth: enAuth,
        dashboard: enDashboard,
        server: enServer,
        admin: enAdmin,
    },
    zh: {
        common: zhCommon,
        auth: zhAuth,
        dashboard: zhDashboard,
        server: zhServer,
        admin: zhAdmin,
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: getUserLanguage(),
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'server', 'admin'],
    interpolation: {
        escapeValue: false, // React already handles XSS
    },
    react: {
        useSuspense: false,
    },
});

export default i18n;
