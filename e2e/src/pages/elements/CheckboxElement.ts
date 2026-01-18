import { BaseElement } from '../BaseElement';

export class CheckboxElement extends BaseElement {

    async setValue(value: boolean) {
        if (!value && await this.isChecked()
            || value && !await this.isChecked()) {
            await this.click()
        }
    }

    async getValue(): Promise<string> {
        return await this.getLocator().inputValue();
    }

}