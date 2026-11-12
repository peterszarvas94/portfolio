# Péter Szarvas

A deliberately small portfolio and résumé. Go serves templ templates and a single stylesheet. Courier Prime is self-hosted; its license is in `static/fonts/OFL.txt`.

## Run

Install the tools in `mise.toml`, then run `mise run dev`. Open http://localhost:8080. Set `PORT` to use another port.

- `/`: career, projects, and background
- `/resume`: the short version

`mise run build` generates the templates and builds `bin/portfolio`. Run the binary from the project directory so it can find `static/`. `mise run check` checks template formatting and runs Go vet. No Node runtime or frontend build is needed.

Use **Print / save PDF** on the résumé. Both pages print the same one-page A4 résumé, without site navigation, the paper border, or homepage extras.

Career content is shared in `templates/page.templ`. Employer year ranges come from the previous résumé; IBM/Kyndryl is grouped because separate dates were not available. Bandcash is explicitly shown as independent work alongside employment.
