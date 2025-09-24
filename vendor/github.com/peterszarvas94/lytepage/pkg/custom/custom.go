package custom

import (
	"maps"

	"github.com/a-h/templ"
)

type routeMap map[string]templ.Component

var routes = make(routeMap)

func RegisterCustomRoute(route string, component templ.Component) {
	routes[route] = component
}

func RegisterCustomRoutes(newRoutes map[string]templ.Component) {
	maps.Copy(routes, newRoutes)
}

func GetRoutes() routeMap {
	return routes
}
