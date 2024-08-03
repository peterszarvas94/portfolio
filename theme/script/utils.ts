import MiniSearch, { SearchResult } from "minisearch";

type File = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  route: string;
};

export async function getFiles(): Promise<File[]> {
  const response = await fetch("/static/files.json");
  if (!response.ok) {
    throw new Error(`Failed to load JSON: ${response.status}`);
  }
  return await response.json();
}

export function getMiniSearch(files: File[]) {
  const miniSearch = new MiniSearch({
    fields: ["title", "excerpt", "content", "route"], // fields to index for full-text search
    storeFields: ["title", "excerpt", "content", "route"], // fields to return with search results
  });

  miniSearch.addAll(files);
  return miniSearch;
}

export function search(query: string, miniSearch: MiniSearch): SearchResult[] {
  const result = miniSearch.search(query);
  return result;
}

export function getQuery() {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);
  const query = searchParams.get("search");
  return query;
}

export function getInput(): HTMLInputElement | null {
  const form = document.querySelector("#search-form");
  const input = form?.querySelector("input[name=search]");
  return (input as HTMLInputElement) ?? null;
}

export function getRoutes(results: SearchResult[]) {
  const routes = results.map((result) => result.route);
  return routes;
}

export function getArticles(): HTMLElement[] {
  const articles = document.querySelectorAll(".article-list li");
  const arr = Array.from(articles);
  return arr as HTMLElement[];
}

export function filterArticles(articles: HTMLElement[], routes: any[]) {
  articles
    .filter((atricle) => {
      const href = atricle.querySelector("a")?.href || "";
      const url = new URL(href);
      const pathname = url.pathname.slice(1);
      if (routes.includes(pathname)) {
        return false;
      } else {
        return true;
      }
    })
    .forEach((atricle) => {
      atricle.style.display = "none";
    });
}
