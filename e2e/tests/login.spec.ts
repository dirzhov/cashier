import { test, expect } from '@playwright/test'
import { Tag } from '../tags'
import { LoginPage } from '../pages/LoginPage';
import { PageFactory } from '../src/pages/PageFactory';
import { User } from '../entities/Models';
import { validAdminUser, validCashierUser } from '../entities/Users';
import { commonTest, testAsAdmin } from '../fixtures'
import { LS } from '../src/utils/LS';


test.describe('Login/Logout', () => {

  commonTest('admin: login works', {
    tag: [Tag.CI, Tag.LoginLogout],
    annotation: {
      type: 'tc',
      description: 'https://testrail.my/200',
    },
  }, async ({ loginPage }) => {
    await loginPage.open()
    await loginPage.login(validAdminUser)
    await loginPage.verifyLoggedIn()
  })


  commonTest('cashier: login works', {
    tag: [Tag.CI, Tag.LoginLogout],
    annotation: {
      type: 'tc',
      description: 'https://testrail.my/201',
    },
  }, async ({ loginPage }) => {
    await loginPage.open()
    await loginPage.login(validCashierUser)
    await loginPage.verifyLoggedIn()
  })


  commonTest('wrong user password', {
    tag: [Tag.CI, Tag.LoginLogout],
    annotation: { type: 'tc', description: 'https://testrail.my/202' },
  }, async ({ loginPage }) => {
    const user: User = structuredClone(validAdminUser);
    user.password = 'wrong_pwd'

    await loginPage.open()
    await loginPage.login(user)
    await loginPage.verifyNotLoggedIn()
    await loginPage.verifyErrorMsg(LS.t('login_error'))
  })


  commonTest('unauthorized: redirect to login page', {
    tag: [Tag.CI, Tag.LoginLogout],
    annotation: { type: 'tc', description: 'https://testrail.my/203' },
  }, async ({ page, loginPage }) => {
    await page.goto('/')
    await loginPage.verifyNotLoggedIn()
  })


  testAsAdmin('admin: logout works', {
    tag: [Tag.CI, Tag.LoginLogout],
    annotation: {
      type: 'tc',
      description: 'https://testrail.my/204',
    },
  }, async ({ loginPage }) => {
    await loginPage.logout()
    await loginPage.verifyNotLoggedIn()
  })

})