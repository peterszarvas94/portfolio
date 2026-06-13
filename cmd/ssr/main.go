package main

import (
	"fmt"
	"os"
	"os/exec"
	"portfolio/common"
	"portfolio/config"
	"strings"

	"github.com/peterszarvas94/lytepage/pkg/custom"
	"github.com/peterszarvas94/lytepage/pkg/pages"
	"github.com/peterszarvas94/lytepage/pkg/ssr"
)

func main() {
	config.Version = version()
	pages.RegisterPages(common.Pages)

	custom.RegisterCustomRoutes(common.CustomRoutes)

	err := ssr.RunServer()
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
}

func version() string {
	out, err := exec.Command("git", "rev-parse", "--short", "HEAD").Output()
	if err != nil {
		return "dev"
	}
	return strings.TrimSpace(string(out))
}
