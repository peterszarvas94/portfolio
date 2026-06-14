package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"portfolio/theme/templates"
	"strings"

	"github.com/a-h/templ"
)

func main() {
	serve := flag.Bool("serve", false, "start dev server on http://localhost:8080")
	flag.Parse()

	outDir := "public"

	os.RemoveAll(outDir)

	writePage := func(component templ.Component, path string) {
		if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
			panic(err)
		}
		f, err := os.Create(path)
		if err != nil {
			panic(err)
		}
		defer f.Close()
		if err := component.Render(context.Background(), f); err != nil {
			panic(err)
		}
	}

	writePage(templates.IndexPage(), filepath.Join(outDir, "index.html"))
	writePage(templates.ResumePage(), filepath.Join(outDir, "resume", "index.html"))
	writePage(templates.NotFoundPage(), filepath.Join(outDir, "404", "index.html"))

	if err := copyDir("theme/static", filepath.Join(outDir, "static")); err != nil {
		panic(err)
	}

	// Copy root favicon
	if data, err := os.ReadFile("theme/static/favicon.ico"); err == nil {
		os.WriteFile(filepath.Join(outDir, "favicon.ico"), data, 0644)
	}

	fmt.Println("Generated public/")

	if *serve {
		fmt.Println("Serving on http://localhost:8080")
		if err := http.ListenAndServe(":8080", fileServer(outDir)); err != nil {
			panic(err)
		}
	}
}

func fileServer(root string) http.Handler {
	dir := http.Dir(root)
	fs := http.FileServer(dir)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") {
			fs.ServeHTTP(w, r)
			return
		}

		if _, err := dir.Open(r.URL.Path); err == nil {
			fs.ServeHTTP(w, r)
			return
		}

		indexPath := r.URL.Path + "/index.html"
		if _, err := dir.Open(indexPath); err == nil {
			r.URL.Path = indexPath
			fs.ServeHTTP(w, r)
			return
		}

		r.URL.Path = "/404/index.html"
		fs.ServeHTTP(w, r)
	})
}

func copyDir(src, dst string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		rel, _ := filepath.Rel(src, path)
		target := filepath.Join(dst, rel)
		if info.IsDir() {
			return os.MkdirAll(target, 0755)
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		return os.WriteFile(target, data, info.Mode())
	})
}
