import { test } from '@playwright/test'
import { testAsAdmin } from '../../fixtures'
import { Tag } from '../../tags'
import { Product } from '../../entities/Models'
import { product1 } from '../../entities/Products'


testAsAdmin('create and delete new product', {
  tag: [Tag.CI, Tag.Products],
  annotation: [
    { type: 'tc', description: 'https://testrail.my/101' },
    { type: 'issue', description: 'https://jira.com/issues/23180' },
  ]}, async ({ page, productsPage }) => {
  
  const newProduct: Product = structuredClone(product1)
  newProduct.name = `new_product ${Date.now()}`
  newProduct.price = 19.99

  await test.step('Create new product', async () => {
    await productsPage.createProduct(newProduct)
  })

  await test.step('Verify product is created and added on first position', async () => {
    await productsPage.verifyProductExists(newProduct)
  })

  await test.step('Delete product', async () => {
    await productsPage.deleteProduct(newProduct)
  })

  await test.step('Verify deleted product is not in the list', async () => {
    await productsPage.verifyProductIsAbsent(newProduct);
    await page.reload()
    await productsPage.verifyProductIsAbsent(newProduct);
  })

})
