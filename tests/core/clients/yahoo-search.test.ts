import { test, expect } from "@playwright/test";
import { YahooSearch } from "../../../src/core";

test.describe("yahoo-search", () => {
  test("loads search results", async () => {
    const yahooSearch = new YahooSearch(); // or BingSearch or DuckDuckGoSearch
    const query = "Tutorials on Programming in Python";

    const results = await yahooSearch
      .init()
      .then(() => yahooSearch.search("Tutorials on Programming in Python"))
      .then(() => yahooSearch.getResults());

    // Expect a title "to contain" a substring.
    await expect(results.query).toEqual(query);
    await expect(results.results.length).toBeGreaterThan(10);

    await yahooSearch.dispose();
  });
});
