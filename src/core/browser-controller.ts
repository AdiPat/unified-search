import { assert } from "console";
import puppeteer, { Browser, ElementHandle, Page } from "puppeteer";

class BrowserController {
  private instance: Browser | null; // browser instance
  private curPage: Page | null;

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

  constructUrl(query: string): string {
    const url_ = new URL("https://www.google.com/search");
    const params = new URLSearchParams(url_.search);
    params.append("q", query);
    url_.search = params.toString();
    const url = url_.toString();
    return url;
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
    this.curPage = page;
    const url = this.constructUrl(query);

    await this.curPage.goto(url);
  }

  /**
   *
   * Scrape page result links and return a JSON array of all links
   * @returns array result links
   */
  async scrapePageResultLinks() {
    await new Promise((res, rej) => setTimeout(res, 200)); // this is bad, but unavoidable for now
    const resultLinks = await this.curPage.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a[data-ved]"));
      return links.map((link) => ({
        href: (link as any).href,
        text: link.textContent,
      }));
    });

    return resultLinks;
  }
}

export { BrowserController };
