import { ButtonElement } from "../src/pages/elements/ButtonElement";
import { InputElement } from "../src/pages/elements/InputElement";
import { expect, test } from "@playwright/test";
import { Product } from "../entities/Models";
import { ProductsTable } from "./components/ProductsTable";
import { ProductTableItem } from "./components/ProductTableItem";
import { Layout } from "./Layout";
import { SortField } from "../entities/Products";
import { LS } from "../src/utils/LS";
import { firstDirExistsSync, getFirstDirectoryFromPath } from "../src/utils/firstDirCheck";
import { retryAsyncUntilDefined } from "ts-retry";
import { RetryUtilsOptions } from "ts-retry/lib/cjs/retry";


export class ProductsPage extends Layout {

    searchInp = new InputElement(this.page, 'input[data-testid="product-search"]');

    nameInp = new InputElement(this.page, '.form input:nth-child(1)');
    priceInp = new InputElement(this.page, '.form input:nth-child(2)');
    stockInp = new InputElement(this.page, '.form input:nth-child(3)');

    saveBtn = new ButtonElement(this.page, '[data-testid="save"]');
    cancelBtn = new ButtonElement(this.page, '[data-testid="cancel"]');

    productsTable = new ProductsTable(this.page, '//table[thead]');


    getTitle(): string {
        return  "Products Page";
    }

    async open() {
        await this.page.goto('/');
    }

    private checkProductPosition(position: number) {
        if (position < 1) {
            throw new Error('Position must be greater than zero');
        }
    }

    private checkProductImagePath(path: string) {
        if (!path) {
            throw new Error('File path for image must be provided');
        }
    }

    private processFixturePath(path: string): string {
        if (!firstDirExistsSync(path))  {
            return path.replace(getFirstDirectoryFromPath(path) + '/', '');
        }
        return path;
    }

    async uploadImage(position: number, path: string) {
        this.checkProductPosition(position);
        this.checkProductImagePath(path);

        path = this.processFixturePath(path);

        const fileInput = this.productsTable.product(position).uploadBtn
        await expect(fileInput.element).toBeVisible()

        await fileInput.element.setInputFiles(path)
    }

    async verifyUploadedImage(position: number, url: RegExp | string) {
        this.checkProductPosition(position);

        const img = this.productsTable.product(position).image
        await expect(img.element).toBeVisible()

        const src = await img.element.getAttribute('src')
        expect(src).toMatch(url)
    }

    async sortyBy(field: SortField) {
        switch (field) {
            case SortField.name:
                await this.productsTable.nameHeader.click();
                break;
            case SortField.price:
                await this.productsTable.priceHeader.click();
                break;
            case SortField.stock:
                await this.productsTable.stockHeader.click();
                break;
            default:
                throw new Error(`Unsupported sort field: ${field}`);
        }
        await this.page.waitForTimeout(300); // wait for sorting to complete
    }

    async getPricesList(): Promise<number[]> {
        const pricesText = (await this.productsTable.allProducts()).map(async (product) => {
            const text = await product.priceTxt.getTextContent();
            return text ? Number(text.replace('$', '')) : 0;
        });
        return Promise.all(pricesText);
    }

    async edit(product: Product, position?: number) {
        if (position) {
            await this.productsTable.product(position).editBtn.click();
        } else {
            const foundPosition = (await this.productsTable.allProducts()).findIndex(async (p: ProductTableItem) => {
                const name = await p.nameTxt.getText();
                return name === product.name;
            })
            if (foundPosition === -1) {
                throw new Error(`Product with name ${product.name} not found`);
            }

            await this.productsTable.product(foundPosition).editBtn.click();
        }
    }

    async createProduct(product: Product) {
        await this.nameInp.setValue(product.name);
        await this.priceInp.setValue(product.price.toString());
        await this.stockInp.setValue(product.stock.toString());
        
        await this.saveBtn.click();
    }

    async verifyProductExists(product: Product) {
        const productItem = await this.findProductByName(product);

        if (productItem == null) {
            throw new Error(`Product with name ${product.name} not found`);
        }

        const softExpect = expect.configure({ soft: true, timeout: 5_000 })

        softExpect(productItem.nameTxt.element).toHaveText(product.name);
        softExpect(productItem.priceTxt.element).toHaveText('$' + product.price.toString());
        softExpect(productItem.stockTxt.element).toHaveText(product.stock.toString());
        expect(test.info().errors).toHaveLength(0);
    }

    async verifyProductIsAbsent(product: Product) {
        try {
            await this.findProductByName(product, {maxTry: 2});
            throw new Error(`Product with name ${product.name} is present`);
        } catch {
        }
    }

    async deleteProduct(product: Product) {
        const productItem = await this.findProductByName(product);

        if (!productItem) {
            throw new Error(`Product with name ${product.name} not found`);
        }

        await Promise.all([
            productItem.deleteBtn.click(),

            this.page.waitForEvent('dialog').then(async (dialog) => {
                expect(dialog.type()).toBe('confirm');
                expect(dialog.message()).toBe(LS.t('delete_product') + '?');

                await dialog.accept();
            }),
        ]);

    }

    async findProductByName(product: Product, options?: RetryUtilsOptions): Promise<ProductTableItem | null> {
        return await retryAsyncUntilDefined(async () => {
            return await this.productsTable.findProductByName(product.name);
        }, { delay: 1000, maxTry: 3, ...options });
    }

    async readProductFromUI(productItem: ProductTableItem) : Promise<Product> {
        const product: Product = {} as Product;
        product.name = (await productItem.nameTxt.getText()).trim();
        product.price = Number((await productItem.priceTxt.getText())?.trim().replace('$', ''))
        product.stock = Number((await productItem.stockTxt.getText())?.trim())
        return product;
    }
    
    async changeProduct(productItem: ProductTableItem, product: Product) {
        await productItem.editBtn.click()
      
        if (product.name)
            await this.nameInp.setValue(`${product.name}`)
        
        if (product.price)
            await this.priceInp.setValue(`${product.price}`)
        
        if (product.stock)
            await this.stockInp.setValue(`${product.stock}`)
        

        await this.saveBtn.click()
    }

}