import { BasePage } from "../src/pages/BasePage";
import { ButtonElement } from "../src/pages/elements/ButtonElement";

export class Layout extends BasePage {

  logoutBtn = new ButtonElement(this.page, '[data-testid="logout-btn"]');

  getTitle(): string {
    return  "Layout"
  }

  async open() {
    await this.page.goto('/')
  }

  async logout() {
    await this.logoutBtn.click()
  }

}