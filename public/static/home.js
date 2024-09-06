function o(e) {
  const { navElementId: t, elementId: d, withScroll: c, hide: a } = e, l = document.getElementById(t), n = document.getElementById(d);
  if (!n || !l || (l.addEventListener("click", (s) => {
    s.preventDefault(), m(n);
  }), !c))
    return;
  const r = u(n);
  window.addEventListener("scroll", r), window.addEventListener("load", r), a && (n.setAttribute("href", ""), n.classList.add("opacity-0"));
}
function u(e) {
  const t = function() {
    i(e) <= window.innerHeight / 2 && (e.classList.add("animate-slide-5"), window.removeEventListener("scroll", t));
  };
  return t;
}
function i(e) {
  return e.getBoundingClientRect().top;
}
function m(e) {
  window.scrollTo({
    top: i(e) + window.scrollY,
    behavior: "smooth"
  });
}
function h() {
  o({
    navElementId: "nav-about",
    elementId: "about",
    withScroll: !0,
    hide: !0
  }), o({
    navElementId: "nav-projects",
    elementId: "projects",
    withScroll: !0,
    hide: !0
  }), o({
    navElementId: "nav-contact",
    elementId: "contact",
    withScroll: !0,
    hide: !0
  }), o({
    navElementId: "nav-header",
    elementId: "header",
    withScroll: !1,
    hide: !1
  });
}
h();
