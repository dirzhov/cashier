import { expect } from "playwright/types/test";
import { ButtonElement } from "../../src/pages/elements/ButtonElement";
import { CompositeElement } from "../../src/pages/elements/CompositeElement";
import { ProductTableItem } from "./ProductTableItem";

export class ProductsTable extends CompositeElement {

    private static readonly HEADER = 'thead tr:nth-child(1)'

    imgHeader = new ButtonElement(this.locator, `${ProductsTable.HEADER} th:nth-child(1)`);
    nameHeader = new ButtonElement(this.locator, `${ProductsTable.HEADER} th:nth-child(2)`);
    priceHeader = new ButtonElement(this.locator, `${ProductsTable.HEADER} th:nth-child(3)`);
    stockHeader = new ButtonElement(this.locator, `${ProductsTable.HEADER} th:nth-child(4)`);
    uploadHeader = new ButtonElement(this.locator, `${ProductsTable.HEADER} th:nth-child(5)`);
    actionsHeader = new ButtonElement(this.locator, `${ProductsTable.HEADER} th:nth-child(6)`);

    public product = (position: number) =>
        new ProductTableItem(this.locator.locator('tbody'), `tr:nth-child(${position})`);

    public allProducts = async () : Promise<ProductTableItem[]> =>
        (await this.locator.locator('tbody').locator('tr').all()).map((row, index) =>
            new ProductTableItem(this.locator.locator('tbody'), `tr:nth-child(${index + 1})`));
    
    public waitForProductWithName(name: string): Promise<ProductTableItem> {
        return new ProductTableItem(this.locator.locator('tbody')
            .locator(`//tr[td[position()=2 and .="${name}"]]`).first())
            .waitForVisible();
    }
    
    async findProductByName(name: string): Promise<ProductTableItem | null> {
        const products = await this.allProducts();

        for (const p of products) {
            const actualName = await p.nameTxt.getText();
            if (actualName === name) {
                return p;
            }
        }

        return null;
    }

}