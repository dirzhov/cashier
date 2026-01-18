import { test, expect } from '@playwright/test'
import { testAsAdmin } from '../../fixtures'
import { Tag } from '../../tags'
import { SortField } from '../../entities/Products'
import { Product } from '../../entities/Models';


test.describe('Edit/Sort product', () => {

  testAsAdmin('ADMIN: edit product name', {
    tag: [Tag.CI, Tag.Products, Tag.Flaky],
    annotation: { type: 'tc', description: 'https://testrail.my/102' },
  }, async ({ productsPage, resource, db }) => {

    let product = productsPage.productsTable.product(2)

    const oldName = await product.nameTxt.element.textContent();
    const newName = `${oldName} UPDATED`;
    const dbProduct = await db.products.getByName(oldName ?? '');

    await test.step('Update product name', async () => {
      await product.editBtn.click()
      await productsPage.nameInp.setValue(newName)
      await productsPage.saveBtn.click()
    })

    await test.step('Verify product name is updated', async () => {
      await productsPage.productsTable.waitForProductWithName(`${newName}`);
      await product.verifyProductName(`${newName}`);
    })

    // return product name back after test
    resource.cleanup = async () => {
      if (!dbProduct || !oldName) return;

      const updated = await db.products.update(dbProduct.id, {
        name: oldName
      })

      expect(updated.name).toEqual(oldName);
      
      await productsPage.reload();
      product = productsPage.productsTable.product(2);
      await product.verifyProductName(`${oldName}`);
    };

  })


  testAsAdmin('admin: edit product price', {
    tag: [Tag.CI, Tag.Products],
    annotation: { type: 'tc', description: 'https://testrail.my/103' },
  }, async ({ productsPage, resource, db }) => {

    let producItem = productsPage.productsTable.product(1);
    const oldProduct = await productsPage.readProductFromUI(producItem);
    const dbProduct = await db.products.getByName(oldProduct.name ?? '');
    const newProduct = structuredClone(oldProduct);
    newProduct.price = oldProduct.price + 10000;

    await test.step('Update product price', async () => {
      await productsPage.changeProduct(producItem, newProduct);
    })

    await test.step('Verify product price is updated', async () => {
      await producItem.verifyProductPrice(`$${newProduct.price}`);
    })

    resource.cleanup = async () => {
      if (!dbProduct) return;

      const updated = await db.products.update(dbProduct.id, {
        price: oldProduct.price
      })

      expect(updated.price).toEqual(oldProduct.price);

      await productsPage.reload();
      producItem = productsPage.productsTable.product(1);
      await producItem.verifyProductPrice(`$${oldProduct.price}`);
    };
  })


  testAsAdmin('admin: sort products by price', {
    tag: [Tag.CI, Tag.Products],
    annotation: { type: 'tc', description: 'https://testrail.my/104' },
  }, async ({ productsPage }) => {

    await productsPage.sortyBy(SortField.price)

    const prices = await productsPage.getPricesList()
    const sorted = [...prices].sort(
      (a, b) => Number(a) - Number(b)
    )

    expect(prices).toEqual(sorted)


    await productsPage.sortyBy(SortField.price)

    const reversed = [...sorted].reverse()
    const pricesDesc = await productsPage.getPricesList()

    expect(pricesDesc).toEqual(reversed)
  })

});