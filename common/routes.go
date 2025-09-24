package common

import (
	"webpage/theme/templates"

	"github.com/a-h/templ"
)

var CustomRoutes = map[string]templ.Component{
	"/resume": templates.ResumePage(),
}
