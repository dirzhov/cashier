import { test, expect } from '@playwright/test'
import { testAsAdmin, testAsCashier } from '../../fixtures'
import { Tag } from '../../tags'
import { PageFactory } from '../../src/pages/PageFactory';
import { ProductsPage } from '../../pages/ProductsPage';


test.describe('User Permissions', () => {

  testAsCashier('CASHIER cannot access products CRUD', {
    tag: [Tag.CI, Tag.Regression],
    annotation: { type: 'tc', description: 'https://testrail.my/105' },
  }, async ({ productsPage }) => {
    await productsPage.open()
    const firstProduct = productsPage.productsTable.product(1)

    await expect.soft(productsPage.productsTable.nameHeader.element).toBeVisible()
    await expect.soft(productsPage.productsTable.actionsHeader.element).not.toBeVisible()

    await test.step('❌ Verify CRUD buttons are not visible', async () => {
      await expect.soft(productsPage.saveBtn.element).not.toBeVisible()
      await expect.soft(firstProduct.editBtn.element).not.toBeVisible()
      await expect.soft(firstProduct.deleteBtn.element).not.toBeVisible()
    })

    await test.step('❌ Verify upload image buttons are not visible', async () => {
      await expect.soft(productsPage.productsTable.uploadHeader.element).not.toBeVisible()
      await expect.soft(firstProduct.uploadBtn.element).not.toBeVisible()
      expect(test.info().errors).toHaveLength(0)
    })
  })


  testAsAdmin('ADMIN can access products CRUD', {
    tag: [Tag.CI, Tag.Regression],
    annotation: { type: 'tc', description: 'https://testrail.my/106' },
  }, async ({ productsPage }) => {
    await productsPage.open()
    const firstProduct = productsPage.productsTable.product(1)

    await expect.soft(productsPage.productsTable.actionsHeader.element).toBeVisible()

    await test.step('❌ Verify CRUD buttons are visible', async () => {
      await expect.soft(productsPage.saveBtn.element).toBeVisible()
      await expect.soft(firstProduct.editBtn.element).toBeVisible()
      await expect.soft(firstProduct.deleteBtn.element).toBeVisible()
    })

    await test.step('❌ Verify upload image buttons are visible', async () => {
      await expect.soft(productsPage.productsTable.uploadHeader.element).toBeVisible()
      await expect.soft(firstProduct.uploadBtn.element).toBeVisible()
      expect(test.info().errors).toHaveLength(0)
    })
  })

});