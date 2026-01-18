import { test as base, Page } from '@playwright/test'
import * as dotenv from 'dotenv';
import { validAdminUser, validCashierUser } from './entities/Users';
import { LoginPage } from './pages/LoginPage';
import { PageFactory } from './src/pages/PageFactory';
import { LS } from './src/utils/LS';
import { ReportsPage } from './pages/ReportsPage';
import { ProductsPage } from './pages/ProductsPage';
import { sequelize } from './entities/dal/sequelize';
import { userDAL } from './entities/dal/user.dal';
import { productDAL } from './entities/dal/product.dal';


dotenv.config();

type Langs = 'en' | 'ru' | 'ua';

type Fixtures = {
  page: Page;
  db: {
    users: typeof userDAL
    products: typeof productDAL
  };
  resource: { cleanup?: () => Promise<void> }
  setLocale: (locale?: Langs) => void

  // pages
  loginPage: LoginPage
  productsPage: ProductsPage
  reportsPage: ReportsPage
}

export const commonTest = base.extend<Fixtures>({
  resource: async ({}, use) => {
    const resource: any = {};

    await use(resource);

    if (resource.cleanup) {
      await resource.cleanup();
    }
  },

  db: async ({}, use) => {
    const seq = sequelize();
    await seq.authenticate();
    await use({
      users: userDAL,
      products: productDAL
    })
    await seq.close();
  },

  setLocale: async ({}, use) => {
    const defaultLang: string = <string> process.env.APP_DEFAULT_LANG;

    const setLocale = (locale: Langs = <Langs> defaultLang) => {
        LS.setLocale(locale);
    };
    await use(setLocale);
  },

  // pages
  loginPage: async ({ page }, use) => {
    const loginPage: LoginPage = PageFactory.createPage(page, LoginPage);
    await use(loginPage);
  },
  productsPage: async ({ page }, use) => {
    const productsPage: ProductsPage = PageFactory.createPage(page, ProductsPage);
    await use(productsPage);
  },
  reportsPage: async ({ page }, use) => {
    const reportsPage: ReportsPage = PageFactory.createPage(page, ReportsPage);
    await use(reportsPage);
  }
});

export const testAsAdmin = commonTest.extend<Fixtures>({
  page: async ({ browser }, use) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    const defaultLang: Langs = <Langs> process.env.APP_DEFAULT_LANG;
    LS.setLocale(defaultLang);

    const loginPage: LoginPage = PageFactory.createPage(page, LoginPage)

    await loginPage.open()
    await loginPage.login(validAdminUser)
    await page.waitForLoadState('domcontentloaded')

    await use(page)

    await context.close()
  }
})

export const testAsCashier = commonTest.extend<Fixtures>({
  page: async ({ browser }, use) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    const defaultLang: Langs = <Langs> process.env.APP_DEFAULT_LANG;
    LS.setLocale(defaultLang);
    
    const loginPage: LoginPage = PageFactory.createPage(page, LoginPage)

    await loginPage.open()
    await loginPage.login(validCashierUser)
    await page.waitForLoadState('domcontentloaded')

    await use(page)

    await context.close()
  }
})

