import { test, expect } from '@playwright/test'
import { testAsAdmin, testAsCachier } from '../../fixtures'
import { Tag } from '../../tags'



testAsCachier.fixme('cashbox checkout generates PDF receipt', {
  tag: [Tag.CI, Tag.Regression],
  annotation: { type: 'tc', description: 'https://testrail.my/107' },
}, async ({ page }) => {

  await page.goto('/cashbox')

  // 🔹 добавить товар в кассу
  await page.click('button:has-text("Добавить")')

  // 🔹 проверить, что товар появился
  const row = page.locator('tbody tr').first()
  await expect(row).toBeVisible()

  // 🔹 изменить количество
  const qtyInput = row.locator('input[type=number]')
  await qtyInput.fill('2')

  // 🔹 проверить итог
  const total = page.locator('.total')
  await expect(total).toContainText('Итого')

  // 🔹 ожидание скачивания PDF
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("PDF-чек")')
  ])

  // 🔹 проверить файл
  const filename = download.suggestedFilename()
  expect(filename).toContain('receipt')
  expect(filename).toContain('.pdf')
})
