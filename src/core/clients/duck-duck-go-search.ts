import puppeteer, { Browser, Page } from "puppeteer";
import {
  SearchEngine,
  SearchEngineType,
  SearchQueryResult,
} from "../search-engine";
import { constructUrl } from "../utils";

class DuckDuckGoSearch implements SearchEngine {
  private instance: Browser | null; // browser instance
  private curPage: Page | null;
  private isSearchPage: boolean = false;
  private query: string;

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
   * Searches for a given query on Duck Duck Go
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
    const url = constructUrl("https://duckduckgo.com/", query);
    await this.curPage.goto(url);

    this.isSearchPage = true;

    await new Promise((res) => setTimeout(res, 1000));
    await this.scrollPageToBottom();
    return true;
  }

  /**
   *
   * Navigates to the next page in the search results.
   * @returns Array of search results
   *
   */
  async nextPage(): Promise<void> {
    await this.scrollPageToBottom();
    await this.curPage.evaluate(() => {
      const moreResultsButton = document.querySelector(
        "#more-results"
      ) as HTMLElement;
      moreResultsButton.click();
    });
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
      searchEngine: SearchEngineType.GOOGLE,
      results: resultLinks,
    };
  }

  /**
   *
   * Scrolls the current page to the bottom.
   *
   */
  async scrollPageToBottom(): Promise<void> {
    await this.curPage.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
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

export { DuckDuckGoSearch };
