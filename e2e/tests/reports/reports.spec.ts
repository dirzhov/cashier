import test, { expect } from '@playwright/test'
import { testAsAdmin, testAsCashier } from '../../fixtures'
import { Tag } from '../../tags'
import { LS } from '../../src/utils/LS'


test.describe('Reports', () => {

  testAsAdmin('ADMIN can see reports and charts', {
    tag: [Tag.CI, Tag.Regression],
    annotation: { type: 'tc', description: 'https://testrail.my/108' },
  }, async ({ page, reportsPage }) => {
    await reportsPage.open()

    await expect(reportsPage.headerTxt.element).toHaveText(LS.t('reports'))

    await expect(reportsPage.totalRevenue.element).toContainText(LS.t('totalRevenue'))
    await expect(reportsPage.totalSales.element).toContainText(LS.t('totalSales'))
    await expect(reportsPage.totalProducts.element).toContainText(LS.t('totalProducts'))
    await expect(reportsPage.totalUsers.element).toContainText(LS.t('totalUsers'))

    // canvases (charts)
    const canvases = page.locator('canvas')
    await expect(canvases).toHaveCount(2)

    // check that canvases are not empty
    const box = await canvases.first().boundingBox()
    expect(box?.width).toBeGreaterThan(100)
    expect(box?.height).toBeGreaterThan(100)
  })


  testAsCashier('CASHIER cannot access reports', {
    tag: [Tag.CI, Tag.Regression],
    annotation: { type: 'tc', description: 'https://testrail.my/109' },
  }, async ({ page, reportsPage }) => {
    await reportsPage.open()

    // redirected on main page
    await expect.soft(page).not.toHaveURL(/.*\/reports$/)
    
    const canvases = page.locator('canvas')
    await expect.soft(canvases).toHaveCount(0)
  })

})