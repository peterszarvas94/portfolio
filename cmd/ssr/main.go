package main

import (
	"fmt"
	"net/http"
	"path"
	_ "peterszarvas94/blog/pkg/init"
)

func main() {
	staticDirPath := path.Join("theme", "static")

	fs := http.FileServer(http.Dir(staticDirPath))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	faviconPath := path.Join(staticDirPath, "favicon.ico")

	http.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, faviconPath)
	})

	indexHandler := &indexHandler{}
	http.Handle("/{$}", indexHandler)

	categoryHandler := &categoryHandler{}
	http.Handle("/category/{category}/{$}", categoryHandler)

	tagHandler := &tagHandler{}
	http.Handle("/tag/{tag}/{$}", tagHandler)

	contentHandler := &contentHandler{}
	http.Handle("/{segments...}", contentHandler)

	fmt.Println("Server is starting on http://localhost:9999")

	err := http.ListenAndServe("localhost:9999", nil)
	if err != nil {
		panic(err)
	}
}
