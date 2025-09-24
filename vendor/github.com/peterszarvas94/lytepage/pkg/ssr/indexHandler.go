package ssr

import (
	"net/http"

	"github.com/a-h/templ"
	"github.com/peterszarvas94/lytepage/pkg/custom"
	"github.com/peterszarvas94/lytepage/pkg/fileutils"
	"github.com/peterszarvas94/lytepage/pkg/pages"
)

type indexHandler struct{}

func (h *indexHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	customRoutes := custom.GetRoutes()

	err, pages := pages.GetPages()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if customHomePage, exists := customRoutes["/"]; exists {
		handler := templ.Handler(customHomePage)
		handler.ServeHTTP(w, r)
	} else {
		files := fileutils.GetFiles()
		handler := templ.Handler(pages.Index(files))
		handler.ServeHTTP(w, r)
	}
	return
}
