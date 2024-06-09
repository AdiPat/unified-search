import { test, expect } from "@playwright/test";
import { DuckDuckGoSearch } from "../../../src/core";

test.describe("duck-duck-go-search", () => {
  test("loads search results", async () => {
    const ddgSearch = new DuckDuckGoSearch(); // or BingSearch or DuckDuckGoSearch
    const query = "Tutorials on Programming in Python";

    const results = await ddgSearch
      .init()
      .then(() => ddgSearch.search("Tutorials on Programming in Python"))
      .then(() => ddgSearch.getResults());

    // Expect a title "to contain" a substring.
    await expect(results.query).toEqual(query);
    await expect(results.results.length).toBeGreaterThan(10);

    await ddgSearch.dispose();
  });
});
