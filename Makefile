.PHONY: dev tailwind watch build gen ssr static

# run dev server
dev:
	make -j2 tailwind watch

# watch tailwind classes and generate css
tailwind:
	npm run tailwind:watch -C theme/tailwind

# watch files, generate templates, and reload server
watch:
	air -c .air.server.toml

# generate templates and build binary
build:
	npm run tailwind:gen -C theme/tailwind
	templ generate
	go build -o ./bin/main ./cmd/ssr

# run binary
run:
	./bin/main

# generate templates and static (public) folder
gen:
	npm run tailwind:gen -C theme/tailwind
	templ generate
	go run cmd/static/main.go --no-serve

# run in ssr mode (generate pages on request)
ssr:
	npm run tailwind:gen -C theme/tailwind
	templ generate
	go run cmd/ssr/main.go
	
# run in static mode (serve public folder)
static:
	npm run tailwind:gen -C theme/tailwind
	templ generate
	go run cmd/static/main.go
