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

FROM nginxinc/nginx-unprivileged:1.28-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/public/ /usr/share/nginx/html/
EXPOSE 8080
