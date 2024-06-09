import { GoogleSearch, BingSearch, DuckDuckGoSearch } from "./core";

const googleSearch = new GoogleSearch(); // or BingSearch or DuckDuckGoSearch

googleSearch
  .init()
  .then(() => googleSearch.search("Tutorials on Programming in Python"))
  .then(() => googleSearch.getResults())
  .then((results) => console.log({ results }))
  .then(() => googleSearch.dispose());
