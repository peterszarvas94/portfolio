package main

import (
	"context"
	"fmt"
	"os"
	"path"
	"peterszarvas94/blog/pkg"
	"peterszarvas94/blog/pkg/custom"
	_ "peterszarvas94/blog/pkg/init"
	"peterszarvas94/blog/pkg/pages"
)

func main() {
	if _, err := os.Stat("public"); !os.IsNotExist(err) {
		err = os.RemoveAll("public")
		if err != nil {
			panic(err)
		}
		fmt.Println("❌ Removed existing directory: ", "public")
	}

	err := os.Mkdir("public", 0755)
	if err != nil {
		panic(err)
	}

	fmt.Println("✅ Generated public directory: ", "public")

	files := pkg.GetFiles()

	// favicon
	faviconSrc := path.Join("theme", "static", "favicon.ico")
	faviconDst := path.Join("public", "favicon.ico")
	err = copyFile(faviconSrc, faviconDst)
	if err != nil {
		panic(err)
	}

	fmt.Println("🌟 Copied favicon:", faviconDst)

	// index
	indexFileName := path.Join("public", "index.html")
	indexFile, err := os.Create(indexFileName)
	if err != nil {
		panic(err)
	}

	err = pages.Index(files).Render(context.Background(), indexFile)
	if err != nil {
		panic(err)
	}

	fmt.Println("🏠 Generated home page:", indexFileName)

	// 404
	notFoundFileFolder := path.Join("public", "404")
	if err := os.MkdirAll(notFoundFileFolder, 0755); err != nil && err != os.ErrExist {
		panic(err)
	}

	notFoundFileName := path.Join(notFoundFileFolder, "index.html")
	notFoundFile, err := os.Create(notFoundFileName)
	if err != nil {
		panic(err)
	}

	err = pages.NotFound().Render(context.Background(), notFoundFile)
	if err != nil {
		panic(err)
	}

	fmt.Println("🚫 Generated 404 page:", notFoundFileName)

	// posts
	for _, file := range files {
		dir := path.Join("public", file.Fileroute)
		if err := os.MkdirAll(dir, 0755); err != nil && err != os.ErrExist {
			panic(err)
		}

		postFileName := path.Join(dir, "index.html")
		postFile, err := os.Create(postFileName)
		if err != nil {
			panic(err)
		}

		err = pages.Post(file).Render(context.Background(), postFile)
		if err != nil {
			panic(err)
		}

		fmt.Println("📰 Generated content page:", postFileName)
	}

	// tags
	tags := pkg.GetTags()

	for tag, files := range tags {
		dir := path.Join("public", "tag", tag)
		if err := os.MkdirAll(dir, 0755); err != nil && err != os.ErrExist {
			panic(err)
		}

		tagFileName := path.Join(dir, "index.html")
		tagFile, err := os.Create(tagFileName)
		if err != nil {
			panic(err)
		}

		err = pages.Tag(tag, files).Render(context.Background(), tagFile)
		if err != nil {
			panic(err)
		}

		fmt.Println("🔖 Generated tag page:", tagFileName)
	}

	// categories
	category := pkg.GetCategories()

	for category, files := range category {
		dir := path.Join("public", "category", category)
		if err := os.MkdirAll(dir, 0755); err != nil && err != os.ErrExist {
			panic(err)
		}

		categoryFileName := path.Join(dir, "index.html")
		categoryFile, err := os.Create(categoryFileName)
		if err != nil {
			panic(err)
		}

		err = pages.Category(category, files).Render(context.Background(), categoryFile)
		if err != nil {
			panic(err)
		}

		fmt.Println("📓 Generated category page:", categoryFileName)
	}

	// static
	staticSrc := path.Join("theme", "static")
	staticDst := path.Join("public", "static")

	err = CopyDir(staticSrc, staticDst)
	if err != nil {
		panic(err)
	}

	// custom
	for route, component := range *custom.Routes {
		dir := path.Join("public", route)
		if err := os.MkdirAll(dir, 0755); err != nil && err != os.ErrExist {
			panic(err)
		}

		fileName := path.Join(dir, "index.html")
		file, err := os.Create(fileName)
		if err != nil {
			panic(err)
		}

		err = component.Render(context.Background(), file)
		if err != nil {
			panic(err)
		}

		fmt.Println("🔧 Generated custom page:", fileName)
	}

	fmt.Println("✅ Done")
}
