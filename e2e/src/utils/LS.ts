import en from '../../locales/en';
import ru from '../../locales/ru';
import ua from '../../locales/ua';

type Locale = 'en' | 'ru' | 'ua';
type Messages = typeof en;
type Params = Record<string, string | number>;

const locales: Record<Locale, Messages> = {
    en,
    ru,
    ua,
};

function format(template: string, params?: Params): string {
    if (!params) return template;
    return template.replace(/{(\w+)}/g, (_, key) => params[key]?.toString() ?? `{${key}}`);
}

export class LS {
    private static currentLocale: Locale = 'en';

    static setLocale(locale: Locale) {
        LS.currentLocale = locale;
    }

    static getLocale(): Locale {
        return LS.currentLocale;
    }

    static t(key: keyof Messages, params?: Params): string {
        const lang = LS.currentLocale;
        const template = locales[lang][key] ?? key;
        return format(template, params);
    }

    static getAll(): Messages {
        return locales[LS.currentLocale];
    }
}