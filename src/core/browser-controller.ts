import { assert } from "console";
import puppeteer, { Browser, ElementHandle } from "puppeteer";

class BrowserController {
  private instance: Browser | null; // browser instance

  constructor() {}

  /**
   *
   * Initializes a browser instance
   *
   */
  async init() {
    console.log("init()");
    this.instance = await puppeteer.launch({ headless: false }).catch((err) => {
      console.error("Failed to launch browser instance. ");
      return null;
    });
    console.log("init() ended");
  }

  /**
   *
   * Runs a search on Google for given query string
   * @param param0 query (string) Search query to fetch results for
   *
   */
  async search({
    query,
  }: {
    query: string;
    numResults?: number;
  }): Promise<void> {
    assert(Boolean(this.instance), "browser instance is not launched yet");

    const page = await this.instance.newPage();

    await page.goto("https://www.google.com");

    const searchElement = await page.evaluateHandle(() => {
      const xpathResult = document.evaluate(
        "//textarea[@title='Search']",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      return xpathResult.singleNodeValue;
    });

    if (!searchElement) {
      throw new Error("Search textarea not found. ");
    }

    await searchElement.type(query);

    const inputElement = await page.evaluate(() => {
      const inputElement = Array.from(document.querySelectorAll("input")).find(
        (input) => input.value === "Google Search"
      );

      if (inputElement) {
        (inputElement as HTMLInputElement).click();
      } else {
        console.error("Failed to click search button. ");
      }
    });
  }
}

export { BrowserController };
