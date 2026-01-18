import { ImageElement } from "../../src/pages/elements/ImageElement";
import { ButtonElement } from "../../src/pages/elements/ButtonElement";
import { CompositeElement } from "../../src/pages/elements/CompositeElement";
import { TextElement } from "../../src/pages/elements/TextElement";
import { expect } from "@playwright/test";

export class ProductTableItem extends CompositeElement {

    image = new ImageElement(this.locator, 'td:nth-child(1) img');

    nameTxt = new TextElement(this.locator, 'td:nth-child(2)');
    priceTxt = new TextElement(this.locator, 'td:nth-child(3)');
    stockTxt = new TextElement(this.locator, 'td:nth-child(4)');
    
    uploadBtn = new ButtonElement(this.locator, 'td:nth-child(5) input[type="file"]');

    editBtn = new ButtonElement(this.locator, 'td:nth-child(6) .action-btn:nth-child(1)');
    deleteBtn = new ButtonElement(this.locator, 'td:nth-child(6) .action-btn:nth-child(2)');


    async verifyProductName(expectedName: string) {
        await expect(this.nameTxt.element).toHaveText(expectedName);
    }

    async verifyProductPrice(expectedPrice: string) {
        await expect(this.priceTxt.element).toHaveText(expectedPrice);
    }

}