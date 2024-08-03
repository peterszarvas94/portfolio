package init

import (
	"fmt"
	"peterszarvas94/blog/pkg"
)

func init() {
	err := CheckContentDir()
	if err != nil {
		panic(err)
	}

	fmt.Println("✅ Content directory is valid")

	n, err := pkg.CollectFiles()
	if err != nil {
		panic(err)
	}

	fmt.Printf("✅ Collected %d files\n", n)

	err = pkg.WriteFilesJsonFile()
	if err != nil {
		panic(err)
	}

	fmt.Println("✅ Generated files.json")
}
