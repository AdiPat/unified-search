import { test, expect } from "@playwright/test";
import { BingSearch } from "../../../src/core";

test.describe("bing-search", () => {
  test("loads search results", async () => {
    const bingSearch = new BingSearch(); // or BingSearch or DuckDuckGoSearch
    const query = "Tutorials on Programming in Python";

    const results = await bingSearch
      .init()
      .then(() => bingSearch.search("Tutorials on Programming in Python"))
      .then(() => bingSearch.getResults());

    // Expect a title "to contain" a substring.
    await expect(results.query).toEqual(query);
    await expect(results.results.length).toBeGreaterThan(10);

    await bingSearch.dispose();
  });
});
