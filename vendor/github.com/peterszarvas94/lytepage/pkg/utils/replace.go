package utils

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
)

func ReplaceAllString(dir, originalStr, newStr string) error {
	return filepath.WalkDir(dir, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if d.IsDir() && d.Name() == ".git" {
			return filepath.SkipDir
		}

		if d.IsDir() {
			return nil
		}

		content, err := os.ReadFile(path)
		if err != nil {
			fmt.Println(err.Error())
			return err
		}

		newContent := bytes.ReplaceAll(content, []byte(originalStr), []byte(newStr))

		if !bytes.Equal(content, newContent) {
			return os.WriteFile(path, newContent, 0644)
		}

		return nil
	})
}
