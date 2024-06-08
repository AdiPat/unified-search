import puppeteer, { Browser, Page } from "puppeteer";
import {
  SearchEngine,
  SearchEngineType,
  SearchQueryResult,
} from "./search-engine";
import { constructUrl } from "./utils";
class BingSearch implements SearchEngine {
  private instance: Browser | null; // browser instance
  private curPage: Page | null;
  private isSearchPage: boolean = false;
  private curPageNum: number = 0;
  private query: string;

  constructor() {}

  /**
   * Initializes a browser instance
   */
  async init(): Promise<void> {
    this.instance = await puppeteer.launch({ headless: false }).catch((err) => {
      console.error("Failed to launch browser instance. ");
      return null;
    });
  }

  async search(query: string): Promise<boolean> {
    if (!query || query.trim() == "") {
      throw new Error("Invalid query");
    }

    this.query = query;

    if (!this.instance) {
      throw new Error("Browser instance is not launched yet");
    }

    const page = await this.instance.newPage();
    this.curPage = page;
    this.curPageNum = 1;
    const url = constructUrl("https://www.bing.com/search", query);
    await this.curPage.goto(url);

    this.isSearchPage = true;

    await new Promise((res) => setTimeout(res, 1000));
    return true;
  }

  async nextPage(): Promise<void> {
    if (!this.curPage) {
      throw new Error("Current page is not set");
    }

    const nextPageNum = this.curPageNum + 1;

    const result = await this.curPage.evaluate(async (nextPageNum) => {
      const nextPageLink = document.querySelector(
        `a[aria-label="Page ${nextPageNum}"]`
      ) as HTMLElement;

      if (nextPageLink) {
        nextPageLink.click();
        return nextPageNum;
      } else {
        return -1;
      }
    }, nextPageNum);

    await this.curPage.waitForNavigation();

    if (result == -1) {
      throw new Error("Failed to navigate to next page");
    }
  }

  /**
   *
   * Scrape page result links and return a JSON array of all links
   * @returns search results
   *
   */
  async getResults(): Promise<SearchQueryResult> {
    if (!this.isSearchPage) {
      throw new Error("Not on search page. Please run search() first");
    }

    await new Promise((res, rej) => setTimeout(res, 200)); // this is bad, but unavoidable for now

    const resultLinks = await this.curPage.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      return links.map((link) => {
        let parentNode = link.parentNode;

        return {
          url: (link as any).href,
          text: link.textContent,
          title: parentNode.textContent,
        };
      });
    });

    return {
      query: this.query,
      searchEngine: SearchEngineType.BING,
      results: resultLinks,
    };
  }
}

export { BingSearch };
