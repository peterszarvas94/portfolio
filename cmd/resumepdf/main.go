package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

var candidates = []string{
	"chromium",
	"chromium-browser",
	"google-chrome",
	"google-chrome-stable",
}

func main() {
	out := flag.String("out", filepath.Join("static", "Szarvas_Peter_resume.pdf"), "output PDF path")
	urlPath := flag.String("path", "/resume/", "resume page path to print")
	flag.Parse()

	if err := run(*out, *urlPath); err != nil {
		slog.Error("resume pdf failed", "error", err)
		os.Exit(1)
	}
}

func run(out, urlPath string) error {
	if _, err := os.Stat(filepath.Join("public", "resume", "index.html")); err != nil {
		return fmt.Errorf("public/resume/index.html not found, run go run ./cmd first: %w", err)
	}

	bin := os.Getenv("CHROMIUM_BIN")
	if bin == "" {
		var err error
		bin, err = findChromium()
		if err != nil {
			return err
		}
	}
	if _, err := exec.LookPath(bin); err != nil {
		return fmt.Errorf("chromium binary %q not found in PATH: %w", bin, err)
	}

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		return fmt.Errorf("listen: %w", err)
	}
	defer ln.Close()

	srv := &http.Server{Handler: http.FileServer(http.Dir("public"))}
	go func() {
		_ = srv.Serve(ln)
	}()
	defer srv.Close()

	url := fmt.Sprintf("http://%s%s", ln.Addr().String(), urlPath)
	slog.Info("serving resume", "url", url, "chromium", bin)

	if err := waitReady(url, 10*time.Second); err != nil {
		return err
	}

	tmpDir, err := os.MkdirTemp("", "resume-pdf")
	if err != nil {
		return err
	}
	defer os.RemoveAll(tmpDir)
	tmpPDF := filepath.Join(tmpDir, "resume.pdf")

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()
	args := []string{
		"--headless",
		"--disable-gpu",
		"--no-sandbox",
		"--print-to-pdf=" + tmpPDF,
		"--print-to-pdf-no-header",
		url,
	}
	cmd := exec.CommandContext(ctx, bin, args...)
	out_bytes, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("chromium print failed: %w\n%s", err, string(out_bytes))
	}

	info, err := os.Stat(tmpPDF)
	if err != nil {
		return fmt.Errorf("chromium produced no PDF: %w\n%s", err, string(out_bytes))
	}
	if info.Size() == 0 {
		return fmt.Errorf("chromium produced empty PDF")
	}

	if err := os.MkdirAll(filepath.Dir(out), 0755); err != nil {
		return err
	}
	data, err := os.ReadFile(tmpPDF)
	if err != nil {
		return err
	}
	if err := os.WriteFile(out, data, 0644); err != nil {
		return err
	}

	publicCopy := filepath.Join("public", "static", "Szarvas_Peter_resume.pdf")
	if _, err := os.Stat(filepath.Dir(publicCopy)); err == nil {
		_ = os.WriteFile(publicCopy, data, 0644)
	}

	slog.Info("wrote resume pdf", "path", out, "bytes", len(data))
	return nil
}

func findChromium() (string, error) {
	for _, c := range candidates {
		if _, err := exec.LookPath(c); err == nil {
			return c, nil
		}
	}
	return "", fmt.Errorf("no chromium binary found (tried %v), set CHROMIUM_BIN", candidates)
}

func waitReady(url string, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		resp, err := http.Get(url)
		if err == nil {
			resp.Body.Close()
			if resp.StatusCode == 200 {
				return nil
			}
		}
		time.Sleep(200 * time.Millisecond)
	}
	return fmt.Errorf("timed out waiting for %s", url)
}
