import puppeteer from 'puppeteer';
import { SystemInfo } from '../utils/constant';

describe('Homepage', () => {
  it('it should have logo text', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:8000');
    await page.waitForSelector('h1');
    const text = await page.evaluate(() => document.body.innerHTML);
    expect(text).toContain(`<h1>${SystemInfo.name}</h1>`);
    await page.close();
    browser.close();
  });
});
