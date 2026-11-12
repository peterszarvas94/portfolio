package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/a-h/templ"
	"portfolio/templates"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	mux := http.NewServeMux()
	mux.Handle("GET /{$}", templ.Handler(templates.Page()))
	mux.HandleFunc("GET /resume", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/", http.StatusSeeOther)
	})
	mux.HandleFunc("GET /resume.pdf", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Disposition", `attachment; filename="Peter-Szarvas-resume.pdf"`)
		http.ServeFile(w, r, "static/resume.pdf")
	})
	mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	server := &http.Server{Addr: ":" + port, Handler: mux, ReadHeaderTimeout: 5 * time.Second}
	log.Printf("Portfolio: http://localhost:%s", port)
	log.Fatal(server.ListenAndServe())
}
