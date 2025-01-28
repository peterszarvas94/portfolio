# dev mode:

dev/typescript:
	cd theme/script && \
	npm run dev

dev/tailwind:
	cd theme/tailwind && \
	npm run tailwind:watch

dev/templ:
	templ generate --watch --proxy="http://localhost:9999" --open-browser=false -v

dev/server:
	air -c .air.server.toml

dev/assets:
	air -c .air.assets.toml

dev:
	make -j5 dev/typescript dev/tailwind dev/templ dev/server dev/assets

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
