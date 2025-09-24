package fileutils

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type FileJson struct {
	Id      int    `json:"id"`
	Title   string `json:"title"`
	Excerpt string `json:"excerpt"`
	Content string `json:"content"`
	Route   string `json:"route"`
}

func getFilesJson() (string, error) {
	var allFiles []*FileJson
	count := 0

	for _, file := range files {
		if file.Matter.Hidden != true {
			fileJson := &FileJson{
				Id:      count, // TODO unique id on gen?
				Title:   file.Matter.Title,
				Excerpt: file.Matter.Excerpt,
				Content: file.Content,
				Route:   file.Fileroute,
			}
			allFiles = append(allFiles, fileJson)
			count = count + 1
		}
	}

	jsonData, err := json.MarshalIndent(allFiles, "", "  ")
	if err != nil {
		return "", err
	}

	return string(jsonData), nil
}

func WriteFilesJsonFile() error {
	jsonData, err := getFilesJson()
	if err != nil {
		return err
	}

	path := filepath.Join("theme", "static", "files.json")

	err = os.WriteFile(path, []byte(jsonData), 0644)
	if err != nil {
		return err
	}
	return nil
}
