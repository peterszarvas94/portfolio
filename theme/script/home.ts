import { setupLink } from "./utils.ts";

function main() {
  setupLink({
    navElementId: "nav-about",
    elementId: "about",
    withScroll: true,
    hide: true,
  });
  setupLink({
    navElementId: "nav-projects",
    elementId: "projects",
    withScroll: true,
    hide: true,
  });
  setupLink({
    navElementId: "nav-contact",
    elementId: "contact",
    withScroll: true,
    hide: true,
  });

  setupLink({
    navElementId: "nav-header",
    elementId: "header",
    withScroll: false,
    hide: false,
  });
}

main();
