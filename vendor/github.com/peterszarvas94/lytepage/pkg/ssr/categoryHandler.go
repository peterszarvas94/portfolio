package ssr

import (
	"net/http"

	"github.com/a-h/templ"
	"github.com/peterszarvas94/lytepage/pkg/fileutils"
	"github.com/peterszarvas94/lytepage/pkg/pages"
)

type categoryHandler struct{}

func (h *categoryHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	category := r.PathValue("category")

	categories := fileutils.GetCategories()
	files := categories[category]

	err, pages := pages.GetPages()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	handler := templ.Handler(pages.NotFound())

	if len(files) > 0 {
		handler = templ.Handler(pages.Category(category, files))
	}

	handler.ServeHTTP(w, r)
	return
}
