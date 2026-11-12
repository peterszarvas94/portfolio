# Péter Szarvas

A deliberately small, single-page portfolio and résumé. Go serves a templ template, one stylesheet, and a small theme script. Courier Prime is self-hosted; its license is in `static/fonts/OFL.txt`.

## Run

Install the tools in `mise.toml`, then run `mise run dev`. Open http://localhost:8080. Set `PORT` to use another port.

The page includes career history, projects, and background. **Save resume** downloads the compact one-page A4 PDF. **Print resume** opens the browser print dialog with the same compact layout. Homepage extras and controls are excluded from print; print always uses light colors. The print stylesheet requests A4 portrait, 16mm top/bottom and 18mm side margins, and exact print colors. It keeps headings and company entries together and works with background graphics disabled. Browser/printer settings can override CSS, and headers/footers remain a browser setting; the downloadable PDF has those disabled.

The theme selector supports light, dark, and system. The default follows the system, including live changes. Explicit choices are remembered in local storage and synchronized across tabs. The page still follows the system if JavaScript is disabled.

`mise run build` generates templates, refreshes `static/resume.pdf`, and builds `bin/portfolio`. PDF generation requires Chromium (`chromium` on PATH, or set `CHROMIUM_BIN`). Regenerate the PDF with `mise run resume-pdf` after changing résumé content or print styles. The generated PDF is committed so serving the site only requires the binary and `static/`.

Run the binary from the project directory so it can find `static/`. `mise run check` checks template formatting and runs Go vet. No Node runtime or frontend build is needed. `/resume` redirects to the single page for old links.

Career content lives in `templates/page.templ`. Employer year ranges come from the previous résumé; IBM/Kyndryl is grouped because separate dates were not available. Bandcash is explicitly shown as independent work alongside employment.
