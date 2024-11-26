package main

import (
	"fmt"
	"net/http"
	"path"
	"peterszarvas94/blog/pkg"
	"peterszarvas94/blog/pkg/custom"
	"peterszarvas94/blog/pkg/pages"

	"github.com/a-h/templ"
)

type contentHandler struct{}

func (h *contentHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// TODO: assert CheckContentDir has run

	// TODO: only for dev
	r.Header.Set("Cache-Control", "no-store, no-cache, must-revalidate")
	r.Header.Set("Pragma", "no-cache")
	r.Header.Set("Expires", "0")

	url := r.URL.Path

	for route, component := range *custom.Routes {
		if url == route || url == fmt.Sprintf("%s/", route) {
			templ.Handler(component).ServeHTTP(w, r)
			return
		}
	}

	pathToFile := path.Join("content", url)

	pathToFileWithExtension := fmt.Sprintf("%s.md", pathToFile)

	file, err := pkg.FindFileFromFilePath(pathToFileWithExtension)
	if err != nil {
		templ.Handler(pages.NotFound()).ServeHTTP(w, r)
		return
	}

	templ.Handler(pages.Post(file)).ServeHTTP(w, r)
}
