package main

import (
	"net/http"
	"peterszarvas94/blog/pkg"
	"peterszarvas94/blog/pkg/pages"

	"github.com/a-h/templ"
)

type categoryHandler struct{}

func (h *categoryHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	category := r.PathValue("category")

	categories := pkg.GetCategories()
	files := categories[category]

	handler := templ.Handler(pages.NotFound())

	if len(files) > 0 {
		handler = templ.Handler(pages.Category(category, files))
	}

	handler.ServeHTTP(w, r)
	return
}
