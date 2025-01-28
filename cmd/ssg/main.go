package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	fs := http.FileServer(http.Dir("public"))

	notFoundPage := filepath.Join("public", "404", "index.html")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		filePath := filepath.Join("public", r.URL.Path, "index.html")

		fileInfo, err := os.Stat(filePath)
		if os.IsNotExist(err) || (err == nil && fileInfo.IsDir()) {
			w.WriteHeader(http.StatusNotFound)

			content, err := os.ReadFile(notFoundPage)
			if err != nil {
				w.Write([]byte("404 - Page not found"))
				return
			}

			w.Write(content)
			return
		}

		fs.ServeHTTP(w, r)
	})

	fmt.Println("Server is starting on http://localhost:9999")

	err := http.ListenAndServe("localhost:9999", nil)
	if err != nil {
		panic(err)
	}
}
