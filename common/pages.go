package common

import (
	"webpage/theme/templates"

	"github.com/a-h/templ"
	"github.com/peterszarvas94/lytepage/pkg/fileutils"
)

type MyPages struct{}

func (p *MyPages) NotFound() templ.Component {
	return templates.NotFoundPage()
}

func (p *MyPages) Index(files []*fileutils.FileData) templ.Component {
	return templates.IndexPage()
}

func (p *MyPages) Category(category string, files []*fileutils.FileData) templ.Component {
	return templates.CategoryPage(category, files)
}

func (p *MyPages) Post(post *fileutils.FileData) templ.Component {
	return templates.PostPage(post)
}
func (p *MyPages) Tag(tag string, files []*fileutils.FileData) templ.Component {
	return templates.TagPage(tag, files)
}

var Pages = &MyPages{}
