type Props = {
  navElementId: string;
  elementId: string;
  withScroll: boolean;
  hide: boolean;
};

export function setupLink(props: Props) {
  const { navElementId, elementId, withScroll, hide } = props;

  const navElement = document.getElementById(navElementId);
  const element = document.getElementById(elementId);

  if (!element || !navElement) {
    return;
  }

  navElement.addEventListener("click", (event) => {
    event.preventDefault();
    scrollToElement(element);
  });

  if (!withScroll) {
    return;
  }

  const scrollListener = makeScrollListener(element);

  window.addEventListener("scroll", scrollListener);
  window.addEventListener("load", scrollListener);

  if (!hide) {
    return;
  }

  element.setAttribute("href", "");
  element.classList.add("opacity-0");
}

function makeScrollListener(element: HTMLElement) {
  const listener = function () {
    if (getElementTop(element) <= window.innerHeight / 2) {
      element.classList.add("animate-slide-5");
      window.removeEventListener("scroll", listener);
    }
  };
  return listener;
}

function getElementTop(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top;
}

function scrollToElement(el: HTMLElement) {
  window.scrollTo({
    top: getElementTop(el) + window.scrollY,
    behavior: "smooth",
  });
  return;
}

export function hide(elementId: string) {
  const element = document.getElementById(elementId);
  element?.classList.add("opacity-0");
}
