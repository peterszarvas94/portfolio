package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"flag"
	"fmt"
	"log/slog"
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

	slog.Info("cleaning output directory", "dir", outDir)
	os.RemoveAll(outDir)

	fingerprint := fingerprintCSS(outDir)

	writePage := func(component templ.Component, path string) {
		slog.Info("rendering page", "path", path)
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

	writePage(templates.IndexPage(fingerprint), filepath.Join(outDir, "index.html"))
	writePage(templates.ResumePage(fingerprint), filepath.Join(outDir, "resume", "index.html"))
	writePage(templates.NotFoundPage(fingerprint), filepath.Join(outDir, "404", "index.html"))

	slog.Info("copying static assets", "src", "theme/static", "dst", filepath.Join(outDir, "static"))
	if err := copyDir("theme/static", filepath.Join(outDir, "static"), "css", "js"); err != nil {
		panic(err)
	}

	// Copy root favicon
	if data, err := os.ReadFile("theme/static/favicon.ico"); err == nil {
		os.WriteFile(filepath.Join(outDir, "favicon.ico"), data, 0644)
		slog.Info("copied favicon")
	}

	slog.Info("build complete", "dir", outDir)

	if *serve {
		slog.Info("starting dev server", "url", "http://localhost:8080")
		if err := http.ListenAndServe("localhost:8080", fileServer(outDir)); err != nil {
			panic(err)
		}
	}
}

func fingerprintCSS(outDir string) string {
	fp := make([]byte, 4)
	if _, err := rand.Read(fp); err != nil {
		panic(err)
	}
	fpStr := hex.EncodeToString(fp)
	slog.Info("generated fingerprint", "fingerprint", fpStr)

	// CSS
	cssSrc := "theme/static/css"
	cssFiles := []string{"base.css", "components.css", "style.css", "utilities.css"}
	outCSSDir := filepath.Join(outDir, "static", "css")
	os.MkdirAll(outCSSDir, 0755)

	for _, name := range cssFiles {
		data, _ := os.ReadFile(filepath.Join(cssSrc, name))

		if name == "style.css" {
			content := string(data)
			content = strings.ReplaceAll(content, `"base.css"`, fmt.Sprintf(`"base.%s.css"`, fpStr))
			content = strings.ReplaceAll(content, `"components.css"`, fmt.Sprintf(`"components.%s.css"`, fpStr))
			content = strings.ReplaceAll(content, `"utilities.css"`, fmt.Sprintf(`"utilities.%s.css"`, fpStr))
			data = []byte(content)
			slog.Info("rewrote @import paths", "file", "style.css")
		}

		outName := fmt.Sprintf("%s.%s.css", strings.TrimSuffix(name, ".css"), fpStr)
		os.WriteFile(filepath.Join(outCSSDir, outName), data, 0644)
		slog.Debug("fingerprinted CSS", "src", name, "dst", outName)
	}

	// JS
	jsSrc := filepath.Join("theme", "static", "js", "main.js")
	jsData, err := os.ReadFile(jsSrc)
	if err != nil {
		panic(err)
	}
	outJSDir := filepath.Join(outDir, "static", "js")
	os.MkdirAll(outJSDir, 0755)
	jsOut := fmt.Sprintf("main.%s.js", fpStr)
	os.WriteFile(filepath.Join(outJSDir, jsOut), jsData, 0644)
	slog.Info("fingerprinted JS", "src", "main.js", "dst", jsOut)

	return fpStr
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

func copyDir(src, dst string, excludeDirs ...string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		rel, _ := filepath.Rel(src, path)
		for _, exclude := range excludeDirs {
			if rel == exclude || strings.HasPrefix(rel, exclude+string(filepath.Separator)) {
				if info.IsDir() {
					return filepath.SkipDir
				}
				return nil
			}
		}
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
