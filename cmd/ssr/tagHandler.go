package main

import (
	"fmt"
	"net/http"
	"peterszarvas94/blog/pkg"
	"peterszarvas94/blog/pkg/pages"

	"github.com/a-h/templ"
)

type tagHandler struct{}

func (h *tagHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	tag := r.PathValue("tag")

	tags := pkg.GetTags()
	files := tags[tag]
	fmt.Println(files)

	handler := templ.Handler(pages.NotFound())

	if len(files) > 0 {
		handler = templ.Handler(pages.Tag(tag, files))
	}

	handler.ServeHTTP(w, r)
	return
}
