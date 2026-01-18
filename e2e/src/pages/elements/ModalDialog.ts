import { CompositeElement } from "../elements/CompositeElement";
import { Page } from "playwright";
import { BaseElement } from "../BaseElement";
import { TextElement } from "./TextElement";

// #form-success.modal
export class ModalDialog extends CompositeElement {

    headerTxt = new TextElement(this.element, '.modal-content .modal-header');
    closeBtn = new TextElement(this.element, '.modal-content .button.close');
    bodyTxt = new TextElement(this.element, '.modal-content .modal-body');

    constructor(page: Page, selector: string) {
        super(page, selector);
    }

}