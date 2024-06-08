import puppeteer, { Browser, Page } from "puppeteer";
import { SEARCH_RESULTS_SCROLL_COUNTER } from "./constants";

class BrowserController {
  private instance: Browser | null; // browser instance
  private curPage: Page | null;
  private isSearchPage: boolean = false;

  constructor() {
    this.isSearchPage = false; // default
  }

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
   * Constructs a URL with query parameter for Google Search
   * @param query Query string to search on Google
   * @returns Formatted URL
   */
  constructUrl(query: string): string {
    const url_ = new URL("https://www.google.com/search");
    const params = new URLSearchParams(url_.search);
    params.append("q", query);
    url_.search = params.toString();
    const url = url_.toString();
    return url;
  }

  /**
   * Scrolls the current page to the bottom
   */
  async scrollPageToBottom(): Promise<void> {
    await this.curPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    let spanWithText = await this.curPage.$$eval("span", (spans) => {
      const span = spans.find((span) => span.textContent === "More results");
      return span ? span.textContent : null;
    });

    const paginationFound = await this.curPage.$$eval("tbody", (tables) => {
      return tables.length > 0;
    });

    let scrollCounter = 0;

    while (!spanWithText || scrollCounter++ < SEARCH_RESULTS_SCROLL_COUNTER) {
      if (paginationFound && scrollCounter >= SEARCH_RESULTS_SCROLL_COUNTER) {
        break;
      }

      await new Promise((res) => setTimeout(res, 1000));
      await this.curPage.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      spanWithText = await this.curPage.$$eval("span", (spans) => {
        const span = spans.find((span) => span.textContent === "More results");
        return span ? span.textContent : null;
      });
    }
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
    if (!this.instance) {
      throw new Error("Browser instance is not launched yet");
    }
    const page = await this.instance.newPage();
    this.curPage = page;
    const url = this.constructUrl(query);
    await this.curPage.goto(url);

    this.isSearchPage = true;

    await new Promise((res) => setTimeout(res, 1000));
    await this.scrollPageToBottom();
  }

  /**
   *
   * Scrape page result links and return a JSON array of all links
   * @returns array result links
   */
  async scrapePageResultLinks() {
    if (!this.isSearchPage) {
      throw new Error("Not on search page. Please run search() first");
    }
    await new Promise((res, rej) => setTimeout(res, 200)); // this is bad, but unavoidable for now

    const resultLinks = await this.curPage.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a[data-ved]"));
      return links.map((link) => {
        let parentNode = link.parentNode;

        return {
          url: (link as any).href,
          text: link.textContent,
          title: parentNode.textContent,
        };
      });
    });

    return resultLinks;
  }
}

export { BrowserController };
