import puppeteer, { Browser, Page } from "puppeteer";
import {
  SearchEngine,
  SearchEngineType,
  SearchQueryResult,
} from "../search-engine";
import { SEARCH_RESULTS_SCROLL_COUNTER } from "../constants";
import { constructUrl } from "../utils";

class YahooSearch implements SearchEngine {
  private instance: Browser | null; // browser instance
  private curPage: Page | null;
  private isSearchPage: boolean = false;
  private query: string;
  private curPageNum: number = 1;

  constructor() {
    this.isSearchPage = false; // default
  }

  /**
   * Initializes a browser instance
   */
  async init(): Promise<void> {
    this.instance = await puppeteer.launch({ headless: false }).catch((err) => {
      console.error("Failed to launch browser instance. ");
      return null;
    });
  }

  /**
   *
   * Searches for a given query on Yahoo Search
   * @param query query string to search
   * @returns true if search page was loaded successfully
   *
   */
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
    const url = constructUrl("https://search.yahoo.com/search", query);
    await this.curPage.goto(url);

    this.isSearchPage = true;

    await new Promise((res) => setTimeout(res, 1000));
    return true;
  }

  /**
   *
   * Navigates to the next page in the search results.
   * @returns Array of search results
   *
   */
  async nextPage(): Promise<void> {
    if (!this.curPage) {
      throw new Error("Current page is not set");
    }

    const nextPageNum = this.curPageNum + 1;

    const result = await this.curPage.evaluate((nextPageNum) => {
      const pagination = document.querySelector(".pages");
      const links = pagination.querySelectorAll("a");
      const nextPageLink = Array.from(links).find(
        (link) => link.innerText == String(nextPageNum)
      ) as HTMLElement;

      if (nextPageLink) {
        nextPageLink.click();
        return nextPageNum;
      } else {
        return -1;
      }
    }, nextPageNum);

    console.log({ result });

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
      searchEngine: SearchEngineType.YAHOO,
      results: resultLinks,
    };
  }

  /**
   *
   * Closes all open resources and browser instance
   *
   */
  async dispose(): Promise<void> {
    await this.instance.close().catch((err) => {
      console.error("Failed to close browser instance. ", err);
    });
  }
}

export { YahooSearch };
