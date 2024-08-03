/**
 * Client side search with MiniSearch
 */

import {
  filterArticles,
  getArticles,
  getFiles,
  getInput,
  getMiniSearch,
  getQuery,
  getRoutes,
  search,
} from "./utils.ts";

async function main() {
  const files = await getFiles();
  const miniSearch = getMiniSearch(files);
  const query = getQuery();
  if (!query) {
    return;
  }

  const results = search(query, miniSearch);

  const input = getInput();
  if (!input) {
    return;
  }
  input.value = query;

  const routes = getRoutes(results);

  const articles = getArticles();
  filterArticles(articles, routes);
}

main();
