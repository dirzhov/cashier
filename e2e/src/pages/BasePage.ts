import { Page } from "playwright";


export abstract class BasePage {

    protected readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }

    abstract getTitle(): string;

    printName() {
        console.log("Hello, " + this.getTitle());
    }

    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    async reload(): Promise<void> {
        await this.page.reload();
    }

    async waitForLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

    async waitForTimeout(timeout: number): Promise<void> {
        await this.page.waitForTimeout(timeout);
    }

}