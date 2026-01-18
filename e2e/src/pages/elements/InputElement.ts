import { BaseElement } from '../BaseElement';

export class InputElement extends BaseElement {

    async setValue(value: string) {
        await this.fill(value);
    }

    async getValue(): Promise<string> {
        return await this.getLocator().inputValue();
    }

    async clear(): Promise<void> {
        await this.locator.fill('');
    }

}