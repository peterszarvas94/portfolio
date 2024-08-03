package pages

import (
	"peterszarvas94/blog/pkg"
	"peterszarvas94/blog/theme/templates"

	"github.com/a-h/templ"
)

type (
	NotFoundPage func() templ.Component
	IndexPage    func(files []*pkg.FileData) templ.Component
	PostPage     func(post *pkg.FileData) templ.Component
	TagPage      func(tag string, files []*pkg.FileData) templ.Component
	CategoryPage func(category string, files []*pkg.FileData) templ.Component
)

var (
	NotFound NotFoundPage = templates.NotFoundPage
	Index    IndexPage    = templates.IndexPage
	Post     PostPage     = templates.PostPage
	Tag      TagPage      = templates.TagPage
	Category CategoryPage = templates.CategoryPage
)
