import { BaseElement } from '../BaseElement';
import { ButtonElement } from "./ButtonElement";

export class Dropdown extends BaseElement {

    async getSelectedOption(): Promise<string> {
        const selected = await this.locator.locator('option:checked').innerText();
        return selected;
    }

    get toggleButton(): ButtonElement {
        // return this.element.locator(`[role="combobox"]`);
        return this.createChild(ButtonElement, '[role="combobox"]');
    }

    async selectOptionEq(text: string): Promise<void> {
        await this.toggleButton.click();
        const option = this.element.locator(`.dropdown-menu >> text=${text}`);
        await option.click();
    }

    async selectOptionContains(text: string): Promise<void> {
        await this.toggleButton.click();
        const option = this.element.locator(`[role="listbox"] li:has-text("${text}")`);
        await option.click();
    }

}