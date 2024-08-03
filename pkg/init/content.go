package init

import (
	"os"
	"peterszarvas94/blog/pkg"
	"peterszarvas94/blog/pkg/custom"
	"strings"
)

var protectedNames = []string{"404", "static", "tag", "category"}

// TODO: check also nested routes, like /custom/1/2/3 -> walk dir
func CheckContentDir() error {
	for route := range *custom.Routes {
		path := strings.TrimPrefix(route, "/")
		protectedNames = append(protectedNames, path)
	}

	folder, err := os.Open("content")
	if err != nil {
		return err
	}

	rootElements, err := folder.Readdir(-1)
	if err != nil {
		return err
	}

	var dirNames []string
	var fileNames []string

	for _, element := range rootElements {
		if element.IsDir() {
			dirNames = append(dirNames, element.Name())
		} else {
			fileNames = append(fileNames, element.Name())
		}
	}

	for _, dirName := range dirNames {
		for _, protectedName := range protectedNames {
			if dirName == protectedName {
				return &pkg.ProtectedNameError{
					Name: dirName,
					Kind: "directory ",
				}
			}
		}
	}

	for _, fileName := range fileNames {
		fileName = strings.Split(fileName, ".")[0]
		for _, protectedName := range protectedNames {
			if fileName == protectedName {
				return &pkg.ProtectedNameError{
					Name: fileName,
					Kind: "file",
				}
			}
		}
	}

	return nil
}
