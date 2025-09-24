package fileutils

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type FileData struct {
	Fileroute string      `json:"fileroute"`
	Matter    FrontMatter `json:"matter"`
	DateTime  time.Time   `json:"datetime"`
	Html      string      `json:"html"`
	Content   string      `json:"content"`
	Path      string      `json:"path"`
}

var files []*FileData

func GetFiles() []*FileData {
	return files
}

func GetFileByTitle(title string) *FileData {
	for _, file := range files {
		if file.Matter.Title == title {
			return file
		}
	}

	return nil
}

func CollectFiles() (int, error) {
	files = files[:0] // Clear the existing slice

	err := filepath.WalkDir("content", walkAndCollect())
	if err != nil {
		return 0, err
	}

	// Sort files by DateTime in descending order
	sort.Slice(files, func(i, j int) bool {
		return files[i].DateTime.After(files[j].DateTime)
	})

	return len(files), nil
}

func walkAndCollect() fs.WalkDirFunc {
	return func(path string, info fs.DirEntry, err error) error {
		if err != nil {
			return fmt.Errorf("failed to access path %s: %w", path, err)
		}

		if info.IsDir() || !strings.HasSuffix(info.Name(), ".md") {
			return nil
		}

		fileData, err := processFile(path)
		if err != nil {
			return err
		}

		files = append(files, fileData)
		return nil
	}
}

func processFile(path string) (*FileData, error) {
	contentBytes, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read file %s: %w", path, err)
	}

	rawContent := string(contentBytes)
	matter, rawBody := parseFrontMatter(rawContent)

	html, err := parseFileContent(rawBody)
	if err != nil {
		return nil, fmt.Errorf("failed to parse file content from file %s: %w", path, err)
	}

	fileroute := strings.TrimSuffix(strings.TrimPrefix(path, "content"), ".md")

	dateTime := parseDateTime(&matter)

	content := StripHTMLTags(html)

	return &FileData{
		Fileroute: fileroute,
		Matter:    matter,
		DateTime:  dateTime,
		Html:      html,
		Content:   content,
		Path:      path,
	}, nil
}

func FindFileFromFilePath(filePath string) (*FileData, error) {
	// TODO: assert collect files is run (not nil)
	for _, file := range files {
		if file.Path == filePath {
			return file, nil
		}
	}

	return nil, fmt.Errorf("file not found: %s", filePath)
}

func GetTags() map[string][]*FileData {
	tags := make(map[string][]*FileData)

	for _, file := range files {
		for _, tag := range file.Matter.Tags {
			tags[tag] = append(tags[tag], file)
		}
	}

	return tags
}

func GetCategories() map[string][]*FileData {
	categories := make(map[string][]*FileData)
	for _, file := range files {
		categories[file.Matter.Category] = append(categories[file.Matter.Category], file)
	}
	return categories
}

func init() {
	n, err := CollectFiles()
	if err != nil {
		panic(err)
	}

	fmt.Printf("✅ Collected %d files\n", n)
}
