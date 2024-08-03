package custom

import (
	"peterszarvas94/blog/theme/templates"

	"github.com/a-h/templ"
)

type routeMap map[string]templ.Component

var Routes = &routeMap{
	"/custom": templates.CustomPage(),
}
