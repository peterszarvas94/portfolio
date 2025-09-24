
.PHONY:  dev/tailwind dev/air gen/build gen/static serve/dev serve/ssr serve/static

# watch tailwind classes and generate css
dev/tailwind:
	npm run tailwind:watch -C theme/tailwind

# watch files, generate templates, and reload server
dev/air:
	air -c .air.server.toml

# generate templates and build binary
gen/build:
	templ generate
	go build -o ./bin/main ./cmd/ssr

# generate templates and static (public) folder
gen/static:
	templ generate
	go run cmd/static/main.go --no-serve

# run dev server
serve/dev:
	make -j5 dev/tailwind dev/air

# run in ssr mode (generate pages on request)
serve/ssr:
	templ generate
	go run cmd/ssr/main.go
	
# run in static mode (serve public folder)
serve/static:
	templ generate
	go run cmd/static/main.go
