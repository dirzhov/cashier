import { TextElement } from "../src/pages/elements/TextElement";
import { Layout } from "./Layout";

export class ReportsPage extends Layout {

  headerTxt = new TextElement(this.page, 'h2');

  totalRevenue = new TextElement(this.page, '.summary > div:nth-child(1)');
  totalSales = new TextElement(this.page, '.summary > div:nth-child(2)');
  totalProducts = new TextElement(this.page, '.summary > div:nth-child(3)');
  totalUsers = new TextElement(this.page, '.summary > div:nth-child(4)');

  getTitle(): string {
      return  "Reports Page";
  }

  async open() {
      await this.page.goto('/reports');
  }


}