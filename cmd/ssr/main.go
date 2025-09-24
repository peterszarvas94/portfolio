package main

import (
	"fmt"
	"os"
	"webpage/common"

	"github.com/peterszarvas94/lytepage/pkg/custom"
	"github.com/peterszarvas94/lytepage/pkg/pages"
	"github.com/peterszarvas94/lytepage/pkg/ssr"
)

func main() {
	pages.RegisterPages(common.Pages)

	custom.RegisterCustomRoutes(common.CustomRoutes)

	err := ssr.RunServer()
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
}
