import { Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

type Constructor<T> = new (page: Page) => T;

export class PageFactory {

    static createPage<T extends BasePage>(page: Page, pageClass: Constructor<T>): T {
        const instance = new pageClass(page);

        // Проксируем свойства страницы для ленивой инициализации элементов
        return new Proxy(instance, {
            get(target, propKey: string) {
                const value = (target as any)[propKey];

                // Если это функция — возвращаем как есть
                if (typeof value === 'function') {
                    return value.bind(target);
                }

                return value;
            },
        }) as T;
    }

}
