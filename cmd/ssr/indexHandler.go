package main

import (
	"net/http"
	"peterszarvas94/blog/pkg"
	"peterszarvas94/blog/pkg/pages"

	"github.com/a-h/templ"
)

type indexHandler struct{}

func (h *indexHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	files := pkg.GetFiles()
	handler := templ.Handler(pages.Index(files))
	handler.ServeHTTP(w, r)
	return
}
