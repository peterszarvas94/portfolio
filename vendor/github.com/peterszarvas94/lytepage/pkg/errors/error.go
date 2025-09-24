package errors

import "fmt"

type ProtectedRouteError struct {
	Filename string
	Route    string
	Kind     string
}

func (e *ProtectedRouteError) Error() string {
	return fmt.Sprintf(
		"You can not have '%s' as filename because '%s' is a %s route",
		e.Filename,
		e.Route,
		e.Kind,
	)
}

type ExistingProtectedRouteError struct {
	Route string
}

func (e *ExistingProtectedRouteError) Error() string {
	return fmt.Sprintf(
		"'%s' is alredy a protected route, please remove it from custom routes",
		e.Route,
	)
}
