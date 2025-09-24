package check

import (
	"fmt"
	"slices"

	"github.com/peterszarvas94/lytepage/pkg/config"
	"github.com/peterszarvas94/lytepage/pkg/custom"
	"github.com/peterszarvas94/lytepage/pkg/errors"
	"github.com/peterszarvas94/lytepage/pkg/fileutils"
)

var protectedRoutes = []string{"/404", "/static", "/tag", "/category"}

func CheckContentDir() error {
	customRoutes := custom.GetRoutes()

	for route := range customRoutes {
		if slices.Contains(protectedRoutes, route) {
			return &errors.ExistingProtectedRouteError{
				Route: route,
			}
		}
	}

	files := fileutils.GetFiles()

	for _, file := range files {
		for route := range customRoutes {
			if file.Fileroute == route {
				return &errors.ProtectedRouteError{
					Filename: file.Path,
					Route:    file.Fileroute,
					Kind:     "custom",
				}
			}
		}
	}

	for _, file := range files {
		if slices.Contains(protectedRoutes, file.Fileroute) {
			return &errors.ProtectedRouteError{
				Filename: file.Path,
				Route:    file.Fileroute,
				Kind:     "protected",
			}
		}
	}

	return nil
}

func init() {
	err := CheckContentDir()
	if err != nil {
		panic(err)
	}

	fmt.Println("✅ Content directory is valid")

	if config.GeneretareFilesJson {
		err = fileutils.WriteFilesJsonFile()
		if err != nil {
			panic(err)
		}

		fmt.Println("✅ Generated files.json")
	}
}
