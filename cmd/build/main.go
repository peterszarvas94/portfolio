// Build renders the site into public/ as plain files for Caddy to serve.
//
//	go run ./cmd/build          build public/
//	go run ./cmd/build -serve   build, then serve public/ on $PORT (default 8080) for local preview
package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"portfolio/templates"
)

const outDir = "public"

func main() {
	serve := flag.Bool("serve", false, "serve public/ after building (local preview only; no redirects)")
	flag.Parse()

	if err := build(); err != nil {
		log.Fatal(err)
	}
	log.Printf("Built %s/", outDir)

	if *serve {
		port := os.Getenv("PORT")
		if port == "" {
			port = "8080"
		}
		log.Printf("Preview: http://localhost:%s", port)
		log.Fatal(http.ListenAndServe(":"+port, http.FileServer(http.Dir(outDir))))
	}
}

func build() error {
	if err := os.RemoveAll(outDir); err != nil {
		return err
	}
	if err := os.MkdirAll(outDir, 0o755); err != nil {
		return err
	}

	page, err := os.Create(filepath.Join(outDir, "index.html"))
	if err != nil {
		return err
	}
	if err := templates.Page().Render(context.Background(), page); err != nil {
		page.Close()
		return fmt.Errorf("render page: %w", err)
	}
	if err := page.Close(); err != nil {
		return err
	}

	// The résumé PDF and favicon live at the site root; everything else under /static/.
	if err := copyFile("static/resume.pdf", filepath.Join(outDir, "resume.pdf")); err != nil {
		return fmt.Errorf("resume.pdf missing; run `mise run resume-pdf`: %w", err)
	}
	if err := copyFile("static/favicon.ico", filepath.Join(outDir, "favicon.ico")); err != nil {
		return err
	}
	return filepath.WalkDir("static", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path == "static/resume.pdf" || path == "static/favicon.ico" {
			return nil
		}
		target := filepath.Join(outDir, path)
		if d.IsDir() {
			return os.MkdirAll(target, 0o755)
		}
		return copyFile(path, target)
	})
}

func copyFile(src, dst string) error {
	in, err := os.Open(src)
	if err != nil {
		return err
	}
	defer in.Close()
	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	if _, err := io.Copy(out, in); err != nil {
		out.Close()
		return err
	}
	return out.Close()
}
