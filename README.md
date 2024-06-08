# Unified Search  🌎

## Introduction

A production-grade search aggregator that scrapes web search results programatically using browser automation.

Unified Search is an attempt to make it easy to retrieve Search Engine results and use those results to do something additional. We all use Search Engines in our day to day life, but sometimes, we want to write programs that can utilize search results (especially links) to do something more complex or advanced (or ridiculously simple too). This library makes it easier to write such programs. 

Unified Search automates your browser to simulate a search session on popular search engines like Google, Bing (Microsoft), and Duck Duck Go (more search engines will be added in future). The results from the search session are returned via a simple function call that can be imported (check examples). 

## Use-Cases 
- **Improve LLM response:** Use search results to improve the generative power of LLMs by augmenting the input with search results.
- **Assist Information Retrieval tasks:** Information Retrieval problems often require data from additional sources, and searching the web is one of the best ways to collect data.
- **Automate search operations for more complex automations:** If an automation requires search results from the web, plug this module into your codebase and let it do it's magic.
- **Do something cool with search results from the web**: The world is your playground, search the web programatically and build great applications.

## Usage 

### Installation 

```unix
npm install unified-search
```

### Example 
```javascript
import { GoogleSearch, BingSearch, DuckDuckGoSearch } from "unified-search";

const googleSearch = new GoogleSearch(); // or BingSearch or DuckDuckGoSearch

googleSearch
  .init()
  .then(() => googleSearch.search("Tutorials on Programming in Python"))
  .then(() => googleSearch.getResults())
  .then((results) => console.log({ results }));
```

## Build with Me

Feel free to fork the repository, make changes and submit a PR. I'd happily accept contributions on this project. I'm currently working on it alone in my spare time, and am the active maintainer. Make sure to test your code thoroughly before submitting a PR.

If you find problems in this library, open an Issue or email me at contact.adityapatange@gmail.com. I'll fix the problems and push an update.

## Contributors 
- [Aditya Patange (@AdiPat)](https://www.github.com/AdiPat)
