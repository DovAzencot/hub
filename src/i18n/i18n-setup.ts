import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { Cookie } from '@nimiq/utils';
import router from '../router';

Vue.use(VueI18n);

const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = [DEFAULT_LANGUAGE, 'fr'];
const LOADED_LANGUAGES: string[] = []; // our default language that is preloaded, if any

export const i18n = new VueI18n({
    locale: DEFAULT_LANGUAGE, // set locale (2 letters format: 'en')
    fallbackLocale: DEFAULT_LANGUAGE, // fallback locale if no translation found
    silentTranslationWarn: true, // disable the "no translation found" warning
});

function setI18nLanguage(lang: string) {
    i18n.locale = lang;
    return lang;
}

export async function loadLanguage(lang: string) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) lang = DEFAULT_LANGUAGE;

    // If the language was already loaded
    if (LOADED_LANGUAGES.includes(lang)) {
        return setI18nLanguage(lang);
    }

    // If the language hasn't been loaded yet
    const messages = await import(/* webpackChunkName: "lang-[request]" */ `@/i18n/${lang}.po`);
    i18n.setLocaleMessage(lang, messages.default || {});
    LOADED_LANGUAGES.push(lang);
    return setI18nLanguage(lang);
}

export function detectLanguage() {
    const langCookie = Cookie.getCookie('lang');
    const langRaw = window.navigator.language;
    const langParts = langRaw.replace('-', '_').split('_');

    return langCookie || langParts[0];
}

router.beforeEach((to, from, next) =>
    loadLanguage(detectLanguage()).then(() => next()),
);
