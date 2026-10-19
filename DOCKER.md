# Docker deployment

Build from the repository root:

```sh
docker build -t portfolio .
docker run --rm -p 127.0.0.1:8080:8080 portfolio
```

The image serves the site on port 8080 as an unprivileged user. Put your
HTTPS reverse proxy in front of this port. In Coolify choose the Dockerfile
build pack, repository-root build context, /Dockerfile, and exposed port 8080.
The existing SSH deployment remains available.

The build generates templ files and the static `public/` output. It uses the
committed resume PDF from `static/`; refresh that PDF with `mise run resume-pdf`
and commit it when the resume changes. Chromium is not needed in this image.
The Datastar/Tiptap demo is a separate application. If sharing this domain,
route `/demo/datastar-tiptap` to its container, strip the prefix, and set that
application's `BASE_PATH` to `/demo/datastar-tiptap`.
