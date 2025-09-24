
.PHONY:  dev/tailwind dev/air gen/build gen/static serve/dev serve/ssr serve/static

# dev mode:
dev/tailwind:
	npm run tailwind:watch -C theme/tailwind

dev/air:
	air -c .air.server.toml

gen/build:
	templ generate
	go build -o ./bin/main ./cmd/ssr

gen/static:
	templ generate
	go run cmd/static/main.go --no-serve

serve/dev:
	make -j5 dev/tailwind dev/air

serve/ssr:
	templ generate
	go run cmd/ssr/main.go
	
serve/static:
	templ generate
	go run cmd/static/main.go
