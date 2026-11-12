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
	mux.Handle("GET /{$}", templ.Handler(templates.Page(false)))
	mux.Handle("GET /resume", templ.Handler(templates.Page(true)))
	mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	server := &http.Server{Addr: ":" + port, Handler: mux, ReadHeaderTimeout: 5 * time.Second}
	log.Printf("Portfolio: http://localhost:%s", port)
	log.Fatal(server.ListenAndServe())
}
