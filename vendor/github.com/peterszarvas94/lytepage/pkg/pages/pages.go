package pages

import (
	"errors"

	"github.com/a-h/templ"
	"github.com/peterszarvas94/lytepage/pkg/fileutils"
)

type Pages interface {
	NotFound() templ.Component
	Index(files []*fileutils.FileData) templ.Component
	Post(post *fileutils.FileData) templ.Component
	Tag(tag string, files []*fileutils.FileData) templ.Component
	Category(category string, files []*fileutils.FileData) templ.Component
}

var registered Pages

func RegisterPages(pages Pages) {
	registered = pages
}

func GetPages() (error, Pages) {
	if registered == nil {
		return errors.New("You should register pages with \"RegisterPages\""), nil
	}
	return nil, registered
}
