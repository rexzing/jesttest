import puppeteer from "puppeteer";
const APP = "http://eval-development-eval.10.10.1.183.xip.io";

const lead = {
  username: "766458467",
  Password: "wolf5",
  countrycode: "+94",
  clinic: "11;Åssiden Dyreklinikk;True"
};

let page;
let browser;
let codeSpan;
let code;

const width = 1920;
const height = 1080;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 40,
    devtools:false,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

describe("Contact form", () => {
  test("user can submit a login request", async () => {
    await page.goto(APP);

    // Login page
    await page.waitForSelector("#Username");
    await page.select("select[name=CountryCode]", lead.countrycode);
    await page.click("input[name=Username]");
    await page.type("input[name=Username]", lead.username);
    await page.click("input[name=Password]");
    await page.type("input[name=Password]", lead.Password);
    await page.click("button[value=login]");

    // Auth code page
    await page.waitForSelector("input[name=CodeInput]");

    // Extract the verification code from auth page
    const featureArticle = (await page.$x("//span[contains(text(), 'Code')]"))[0];
    const code = await page.evaluate(el => {
        return String(el.textContent.split(':')[1].trim());
    }, featureArticle);
    
    await page.click("input[name=CodeInput]");
    await page.type("input[name=CodeInput]", code);
    await page.click("button[value=login]");

    // Select clinic page 
    await page.waitForSelector("select[name=SelectedClinic]");
    await page.select("select[name=SelectedClinic]", lead.clinic);
    await page.click("button[value=login]");
    
    // Wait until appointments page loads
    await page.waitForFunction('document.title == "Appointments | Vetserve"');

    await page.waitFor(3000);
  }, 32000);
});

afterAll(() => {
  browser.close();
});
