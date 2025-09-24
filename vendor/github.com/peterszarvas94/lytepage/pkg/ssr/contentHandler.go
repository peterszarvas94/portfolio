package ssr

import (
	"fmt"
	"net/http"
	"path"

	"github.com/a-h/templ"
	"github.com/peterszarvas94/lytepage/pkg/custom"
	"github.com/peterszarvas94/lytepage/pkg/fileutils"
	"github.com/peterszarvas94/lytepage/pkg/pages"
)

type contentHandler struct{}

func (h *contentHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// TODO: only for dev
	r.Header.Set("Cache-Control", "no-store, no-cache, must-revalidate")
	r.Header.Set("Pragma", "no-cache")
	r.Header.Set("Expires", "0")

	url := r.URL.Path

	customRoutes := custom.GetRoutes()

	for route, component := range customRoutes {
		if url == route || url == fmt.Sprintf("%s/", route) {
			templ.Handler(component).ServeHTTP(w, r)
			return
		}
	}

	pathToFile := path.Join("content", url)

	pathToFileWithExtension := fmt.Sprintf("%s.md", pathToFile)

	err, pages := pages.GetPages()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	file, err := fileutils.FindFileFromFilePath(pathToFileWithExtension)
	if err != nil {
		templ.Handler(pages.NotFound()).ServeHTTP(w, r)
		return
	}

	templ.Handler(pages.Post(file)).ServeHTTP(w, r)
}
