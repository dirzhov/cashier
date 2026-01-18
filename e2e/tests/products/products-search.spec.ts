import { test, expect } from '@playwright/test'
import { testAsAdmin } from '../../fixtures'
import { Tag } from '../../tags'


testAsAdmin('admin: search product by name', {
  tag: [Tag.CI, Tag.Products],
  annotation: { type: 'tc', description: 'https://testrail.my/103' },
}, async ({ productsPage }) => {

  const rowsBefore = (await productsPage.productsTable.allProducts()).length
  expect(rowsBefore).toBeGreaterThan(1)

  await expect(productsPage.searchInp.element).toBeVisible()

  const token: string = 'Кофе'

  await test.step('search by name => product with the exact name is shown only', async () => {
    await productsPage.searchInp.fill(token)

    const rowsAfter = await productsPage.productsTable.allProducts()
    expect(rowsAfter.length).toBe(1)

    await expect(rowsAfter[0].element).toContainText(token)
  })

  await test.step('clear search input => prev number of products', async () => {
    await productsPage.searchInp.clear()
    expect((await productsPage.productsTable.allProducts()).length).toBe(rowsBefore)
  })

})
