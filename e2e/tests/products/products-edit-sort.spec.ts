import { test, expect } from '@playwright/test'
import { testAsAdmin } from '../../fixtures'
import { Tag } from '../../tags'
import { SortField } from '../../entities/Products'
import { ProductTableItem } from '../../pages/components/ProductTableItem';


test.describe('Edit/Sort product', () => {

  testAsAdmin.fixme('ADMIN: edit product name', {
    tag: [Tag.CI, Tag.Products, Tag.Flaky],
    annotation: { type: 'tc', description: 'https://testrail.my/102' },
  }, async ({ productsPage, resource }) => {

    // return product name back after test
    resource.cleanup = async () => {
      let newProduct = await productsPage.productsTable.findProductByName(newName)
      if (newProduct === null) return

      await newProduct.editBtn.click()
      await productsPage.nameInp.setValue(`${oldName}`)
      await productsPage.saveBtn.click()
      await productsPage.waitForTimeout(300);
      newProduct = <ProductTableItem> await productsPage.productsTable.findProductByName(`${oldName}`)
      if (newProduct === null) return

      await expect(newProduct.nameTxt.element).toHaveText(`${oldName}`)
    };

    let product = productsPage.productsTable.product(1)

    const oldName = await product.nameTxt.element.textContent()
    const newName = `${oldName} UPDATED`

    await test.step('Update product name', async () => {
      await product.editBtn.click()
      await productsPage.nameInp.setValue(newName)
      await productsPage.saveBtn.click()
    })

    await test.step('Verify product name is updated', async () => {
        await expect(product.nameTxt.element).toHaveText(newName)
    })

  })


  testAsAdmin('admin: edit product price', {
    tag: [Tag.CI, Tag.Products],
    annotation: { type: 'tc', description: 'https://testrail.my/103' },
  }, async ({ productsPage, resource }) => {

    // return product price back after test
    resource.cleanup = async () => {
      await product.editBtn.click()
      await productsPage.priceInp.setValue(`${oldPrice}`)
      await productsPage.saveBtn.click()
      await productsPage.waitForTimeout(300);
      await expect(product.priceTxt.element).toHaveText(`$${oldPrice}`)
    };

    const product = productsPage.productsTable.product(1)

    const oldPrice = Number((await product.priceTxt.element.textContent())?.replace('$', ''))
    const newPrice = oldPrice + 10000

    await test.step('Update product price', async () => {
      await product.editBtn.click()
      await productsPage.priceInp.setValue(`${newPrice}`)
      await productsPage.saveBtn.click()
    })

    await test.step('Verify product price is updated', async () => {
        await expect(product.priceTxt.element).toHaveText(`$${newPrice}`)
    })
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