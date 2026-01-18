import { Layout } from "./Layout";
import { ButtonElement } from "../src/pages/elements/ButtonElement";
import { InputElement } from "../src/pages/elements/InputElement";
import { expect } from "@playwright/test";
import { TextElement } from "../src/pages/elements/TextElement";
import { User } from "../entities/Models";


export class LoginPage extends Layout {

  headerTxt = new TextElement(this.page, 'h2');

  emailInp = new InputElement(this.page, 'input[type=email]');

  passwordInp = new InputElement(this.page, 'input[type=password]');

  loginBtn = new ButtonElement(this.page, 'button[type=submit]');

  errorMsgTxt = new TextElement(this.page, 'p.error');


  getTitle(): string {
    return "Login Page"
  }

  async open() {
    await this.page.goto('/login')
  }

  async clickLoginBtn() {
    await this.loginBtn.click()
  }

  async verifyLoggedIn() {
    const softExpect = expect.configure({ soft: true, timeout: 5_000 })

    await softExpect(this.page).toHaveURL(/.*\/$/)
    await softExpect(this.loginBtn.element).not.toBeVisible()
  }

  async verifyNotLoggedIn() {
    const softExpect = expect.configure({ soft: true, timeout: 5_000 })

    await softExpect(this.page).toHaveURL(/.*\/login$/)
    await softExpect(this.loginBtn.element).toBeVisible()
    await softExpect(this.logoutBtn.element).not.toBeVisible()
  }

  async login(user: User) {
    await this.emailInp.setValue(user.email)
    await this.passwordInp.setValue(user.password)
    await this.clickLoginBtn()
    await this.waitForTimeout(100)
  }

  async verifyErrorMsg(text: string) {
    await expect(this.errorMsgTxt.element).toHaveText(text)
  }

}