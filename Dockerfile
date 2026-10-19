FROM golang:1.26.9-bookworm AS build
WORKDIR /src
ENV GOFLAGS=-mod=mod
COPY go.mod go.sum ./
RUN go mod download
COPY cmd/ cmd/
COPY templates/ templates/
COPY static/ static/
RUN go run github.com/a-h/templ/cmd/templ@v0.3.1020 generate \
    && go run ./cmd

FROM caddy:2.11-alpine
COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /src/public/ /srv/
USER 10001:10001
EXPOSE 8080
