# dev mode:

templ:
	templ generate --watch --proxy="http://localhost:8080/" --open-browser="false"

dev:
	air -c .air.toml

# ssr mode:

build:
	templ generate
	go build -o ./bin/ssr ./cmd/ssr

ssr:
	./bin/ssr
	
# ssg mode:

gen:
	templ generate
	go run ./cmd/gen

ssg:
	go run ./cmd/ssg
