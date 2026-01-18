import { BaseElement } from '../BaseElement';

export class LinkElement extends BaseElement {

    async getUrl(): Promise<string> {
        return await this.getLocator().getAttribute("href") ?? "";
    }

}