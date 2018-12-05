import puppeteer from "puppeteer";
const APP = "http://eval-development-eval.10.10.1.183.xip.io";

const lead = {
  username: "766458467",
  Password: "****",
  countrycode: "sr" 
};

let page;
let browser;
const width = 1920;
const height = 1080;


beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

describe("Contact form", () => {
  test("lead can submit a contact request", async () => {
    await page.goto(APP);
    await page.waitForSelector("#Username");
    await page.click("input[name=CountryCode]");
    await page.type("input[name=CountryCode]", lead.countrycode);
    await page.click("input[name=Username]");
    await page.type("input[name=Username]", lead.username);
    await page.click("input[name=Password]");
    await page.type("input[name=Password]", lead.Password);
    await page.click("button[value=login]");
    await page.waitFor(10000);
    //await page.waitForSelector(".modal");
  }, 32000);
});

afterAll(() => {
  browser.close();
});
