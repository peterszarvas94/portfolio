package main

import (
	"flag"
	"fmt"
	"os"
	"os/exec"
	"portfolio/common"
	"portfolio/config"
	"strings"

	"github.com/peterszarvas94/lytepage/pkg/custom"
	"github.com/peterszarvas94/lytepage/pkg/generate"
	"github.com/peterszarvas94/lytepage/pkg/pages"
	"github.com/peterszarvas94/lytepage/pkg/static"
)

func main() {
	config.Version = version()
	noserve := flag.Bool("no-serve", false, "Do not start the server, only generate")
	flag.Parse()

	pages.RegisterPages(common.Pages)

	custom.RegisterCustomRoutes(common.CustomRoutes)

	err := generate.Generate()
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	if *noserve {
		os.Exit(0)
	}

	err = static.RunServer()
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
