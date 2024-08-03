---
title: "Introduction"
category: "about"
tags: ["intro", "docs"]
date: "2024.08.12"
time: "11:15"
excerpt:
  "Lite yet powerful static side generator, using the power of go and templ"
---

## Goals

1. Write your templates in go templ
2. Write your content in markdown
3. Generate static HTML
4. Serve HTML with go

## Dependencies

- go 1.22.5
- air
- templ
- make

## Commands

### Develoment mode

- `make templ`: start templ file generation in watch mode
- `make dev`: start dev server with hot reload
  [http://localhost:7331](http://localhost:7331)

### SSR (Server Side Rendering) mode

- `make build`: build go binary
- `make ssr`: start server

### SSG (Static Site Generation) mode

- `make gen`: generate static files

You can put these static files to any server. You can serve them with `go` as
well:

- `make ssg`: start static file server
  [http://localhost:8080](http://localhost:8080)

## Themes

You can put you custom theme under `/theme`.

```txt
theme
├── static
└── templates
```

Put static files like `css`, `js`, images etc. under `theme/static`.

Put `templ` components under `theme/templates`.

Every theme should have the following `templ` components exported from the root
directory of the theme, as you can see in the `pages/page.go`:

```go
type (
	NotFoundPage func() templ.Component
	IndexPage    func(files []*pkg.FileData) templ.Component
	PostPage     func(post *pkg.FileData) templ.Component
	TagPage      func(tag string, files []*pkg.FileData) templ.Component
	CategoryPage func(category string, files []*pkg.FileData) templ.Component
)
```

> You need to implement a catch-all logic in you files server, if you want to
> use the custom 404 (not found) page. If you serve static files via the
> built-in `make ssg` command, this logic is already implemented

### Switching themes

You should backup you old theme folder, before cloning or writing a new theme.
Theme switching is a manual process for now, mabye should be improved in the
future.
