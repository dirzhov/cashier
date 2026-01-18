import { Page, Locator } from '@playwright/test';
import { Frame } from "playwright";

type searchContext = Frame | Page | Locator;

interface DynamicObject {
    [key: string]: any;
}

export class BaseElement {

    protected frame: Frame | null = null;
    protected page: Page;
    public locator: Locator;
    private selector: string;

    constructor(locator: Locator);
    constructor(locator: Locator, selector: string);
    constructor(page: Page, selector: string);
    constructor(frame: Frame, selector: string);

    constructor(...args: any[]) {
        this.selector = args[0];
        if (args.length === 2 && typeof args[0] === 'object' && (args[0] as Frame).frameElement) {
            this.frame = <Frame>args[0];
            this.page = this.frame.page();
            this.locator = this.page.locator(args[1]);
        } else if (args.length === 2 && typeof args[0] === 'object' && (args[0] as Page).mainFrame) {
            this.page = <Page>args[0];
            this.locator = this.page.locator(args[1]);
        } else if (args.length === 2 && typeof args[0] === 'object' && (args[0] as Locator).page) {
            this.page = (<Locator>args[0]).page()
            this.locator = (<Locator>args[0]).locator(args[1]);
        } else if (args.length === 1 && typeof args[0] === 'object' && (args[0] as Locator).page) {
            this.page = (<Locator>args[0]).page()
            this.locator = <Locator>args[0];
        } else {
            throw new Error('Unknown locator or page or frame argument');
        }

    }

    public get element(): Locator {
        return this.locator;
    }

    async click(timeout?: number) {
        const opts: DynamicObject = {};
        if (timeout)
            opts.timeout = timeout;

        await this.locator.click(opts);
    }

    async fill(value: string) {
        await this.locator.fill(value);
    }

    async isVisible(options?: {timeout?: number}): Promise<boolean> {
        return await this.locator.isVisible(options);
    }

    async isHidden(): Promise<boolean> {
        return await this.locator.isHidden();
    }

    async isChecked(): Promise<boolean> {
        return await this.locator.isChecked();
    }

    async waitForVisible(timeout: number = 5000): Promise<this> {
        await this.locator.waitFor({ state: 'visible', timeout });
        return this;
    }

    async waitForHidden(timeout: number = 5000): Promise<this> {
        await this.locator.waitFor({ state: 'hidden', timeout });
        return this;
    }

    async waitForDetached(timeout: number = 5000): Promise<this> {
        await this.locator.waitFor({ state: 'detached', timeout });
        return this;
    }

    public async getText(): Promise<string> {
        return await this.locator.innerText();
    }

    public async getTextContent(): Promise<string | null> {
        return await this.locator.textContent();
    }

    async doubleClick(): Promise<void> {
        await this.locator.dblclick();
    }

    async rightClick(): Promise<void> {
        await this.locator.click({ button: 'right' });
    }

    public getLocator(): Locator {
        return this.locator;
    }

    protected createChild<T extends BaseElement>(ElementClass: new (locator: Locator, selector: string) => T, selector: string): T {
        return new ElementClass(this.element, `${selector}`);
    }
    
}