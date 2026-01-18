import { BaseElement } from '../BaseElement';

export class ButtonElement extends BaseElement {

    async submit() {
        await this.click();
    }

}