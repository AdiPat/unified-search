import { test, expect } from "@playwright/test";
import { GoogleSearch } from "../../../src/core";

test.describe("google-search", () => {
  test("loads search results", async () => {
    const googleSearch = new GoogleSearch(); // or BingSearch or DuckDuckGoSearch
    const query = "Tutorials on Programming in Python";

    const results = await googleSearch
      .init()
      .then(() => googleSearch.search("Tutorials on Programming in Python"))
      .then(() => googleSearch.getResults());

    // Expect a title "to contain" a substring.
    await expect(results.query).toEqual(query);
    await expect(results.results.length).toBeGreaterThan(10);

    await googleSearch.dispose();
  });
});
