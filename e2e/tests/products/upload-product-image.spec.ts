import { testAsAdmin } from '../../fixtures'
import { Tag } from '../../tags'
import { ProductsPage } from '../../pages/ProductsPage'
import { PageFactory } from '../../src/pages/PageFactory'


testAsAdmin('admin can upload product image', {
  tag: [Tag.CI, Tag.Products],
  annotation: { type: 'tc', description: 'https://testrail.my/104' },
}, async ({ productsPage }) => {

  let position = 1;

  await productsPage.uploadImage(position, 'e2e/fixtures/files/product1.jpg')
  await productsPage.verifyUploadedImage(position, /\/uploads\/.*product1.jpg$/)

  position = 2
  await productsPage.uploadImage(position, 'e2e/fixtures/files/product2.jpg')
  await productsPage.verifyUploadedImage(position, /\/uploads\/.*product2.jpg$/)

})
